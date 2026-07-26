// Ties the environment, the network and the PPO maths into a training loop
// that can be stepped one iteration at a time (so the UI stays responsive).

import { ACT_DIM, OBS_DIM, createEnv, mulberry32, reset, step } from "./env";
import {
	adamStep,
	backward,
	clipGradNorm,
	createAdam,
	createMLP,
	forward,
	zeroGrads,
} from "./nn";
import {
	approxKL,
	clipFraction,
	clippedSurrogate,
	computeGAE,
	explainedVariance,
	gaussianEntropy,
	gaussianLogProb,
	normalize,
	sampleGaussian,
} from "./ppo";

export const DEFAULT_HP = {
	lr: 3e-4,
	gamma: 0.99,
	lam: 0.95,
	clipEps: 0.2,
	entCoef: 0.004,
	vfCoef: 0.5,
	epochs: 4,
	minibatch: 256,
	rolloutSteps: 1024,
	maxGradNorm: 0.5,
	normalizeAdv: true,
	targetKL: 0.03, // stop the epoch loop early if the update overshoots
	randomize: false,
	drScale: 1, // strength of domain randomization (0 = nominal)
	hidden: 64,
	initLogStd: -1.0,
};

const LOG_STD_MIN = -3.0;
const LOG_STD_MAX = 0.5;

export function createAgent(hp, rng) {
	const h = hp.hidden;
	// Small final-layer gain on the policy so the initial action distribution
	// sits near hover rather than slamming the rotors to the rails.
	const pi = createMLP([OBS_DIM, h, h, ACT_DIM], rng, 0.01);
	const vf = createMLP([OBS_DIM, h, h, 1], rng, 1.0);
	const logStd = new Float64Array(ACT_DIM).fill(hp.initLogStd);
	return {
		pi,
		vf,
		logStd,
		piOpt: createAdam(pi),
		vfOpt: createAdam(vf),
		// Adam moments for the (small) log-std vector.
		lsM: new Float64Array(ACT_DIM),
		lsV: new Float64Array(ACT_DIM),
		lsT: 0,
		// Running statistics of the return, used to normalize the critic's
		// targets. Discounted returns here reach ~250, and a freshly
		// initialised head starting near zero cannot travel that far at a
		// sane learning rate — the critic underfits by ~7x and explained
		// variance sits at zero. Training it on (R - mean)/std instead, and
		// denormalizing on the way out, keeps the regression target O(1).
		retMean: 0,
		retVar: 1,
		retCount: 1e-4,
	};
}

// Chan et al. parallel variance update, with the count capped so the
// statistics keep adapting as returns grow during training.
function updateReturnStats(agent, returns) {
	const n = returns.length;
	if (!n) return;
	let mean = 0;
	for (let i = 0; i < n; i++) mean += returns[i];
	mean /= n;
	let m2 = 0;
	for (let i = 0; i < n; i++) {
		const d = returns[i] - mean;
		m2 += d * d;
	}
	const batchVar = m2 / n;

	const delta = mean - agent.retMean;
	const tot = agent.retCount + n;
	agent.retMean += (delta * n) / tot;
	const M2 =
		agent.retVar * agent.retCount +
		batchVar * n +
		delta * delta * ((agent.retCount * n) / tot);
	agent.retVar = M2 / tot;
	agent.retCount = Math.min(tot, 20000);
}

export function returnStd(agent) {
	return Math.sqrt(Math.max(agent.retVar, 1e-8));
}

export function policyMean(agent, obs) {
	const acts = forward(agent.pi, obs);
	return acts[agent.pi.nLayers];
}

/** Value in *reward* units — the network predicts a normalized value. */
export function valueOf(agent, obs) {
	const acts = forward(agent.vf, obs);
	return acts[agent.vf.nLayers][0] * returnStd(agent) + agent.retMean;
}

/** Greedy action (no exploration noise) — used for evaluation and the demo. */
export function actGreedy(agent, obs) {
	return policyMean(agent, obs);
}

export function createTrainer(userHp = {}, seed = 20260726) {
	const hp = { ...DEFAULT_HP, ...userHp };
	const rng = mulberry32(seed);
	const env = createEnv({ rng });
	const agent = createAgent(hp, rng);
	return {
		hp,
		rng,
		env,
		agent,
		obs: reset(env, { randomize: hp.randomize, drScale: hp.drScale }),
		iteration: 0,
		totalSteps: 0,
		episodeReturn: 0,
		episodeLen: 0,
		recentReturns: [],
	};
}

/** Roll out `hp.rolloutSteps` transitions with the current policy. */
export function collectRollout(t) {
	const { hp, agent, env, rng } = t;
	const n = hp.rolloutSteps;
	const obsBuf = new Array(n);
	const actBuf = new Array(n);
	const logpBuf = new Float64Array(n);
	const valBuf = new Float64Array(n);
	const rewBuf = new Float64Array(n);
	const doneBuf = new Array(n).fill(false);
	const nextValBuf = new Float64Array(n);
	const needsNext = new Array(n).fill(false);
	const finishedReturns = [];
	let crashes = 0;
	let episodes = 0;

	for (let i = 0; i < n; i++) {
		const obs = t.obs;
		const mean = policyMean(agent, obs);
		const action = sampleGaussian(mean, agent.logStd, rng);
		const logp = gaussianLogProb(action, mean, agent.logStd);
		const value = valueOf(agent, obs);

		const res = step(env, action);

		obsBuf[i] = obs;
		actBuf[i] = action;
		logpBuf[i] = logp;
		valBuf[i] = value;
		rewBuf[i] = res.reward;
		doneBuf[i] = res.done;

		t.episodeReturn += res.reward;
		t.episodeLen += 1;

		if (res.done) {
			// Bootstrap through a time-limit, but not through a crash.
			nextValBuf[i] = res.crashed ? 0 : valueOf(agent, res.obs);
			if (res.crashed) crashes++;
			episodes++;
			finishedReturns.push(t.episodeReturn);
			t.episodeReturn = 0;
			t.episodeLen = 0;
			t.obs = reset(env, { randomize: hp.randomize, drScale: hp.drScale });
		} else {
			needsNext[i] = true; // filled in from the next step's value
			t.obs = res.obs;
		}
	}

	for (let i = 0; i < n; i++) {
		if (!needsNext[i]) continue;
		nextValBuf[i] = i + 1 < n ? valBuf[i + 1] : valueOf(agent, t.obs);
	}

	t.totalSteps += n;
	return {
		obsBuf,
		actBuf,
		logpBuf,
		valBuf,
		rewBuf,
		doneBuf,
		nextValBuf,
		finishedReturns,
		crashes,
		episodes,
	};
}

/** One PPO update over a collected rollout. Returns diagnostics. */
export function update(t, batch) {
	const { hp, agent } = t;
	const n = hp.rolloutSteps;

	const { advantages, returns } = computeGAE(
		batch.rewBuf,
		batch.valBuf,
		batch.nextValBuf,
		batch.doneBuf,
		hp.gamma,
		hp.lam
	);
	const advForLoss = hp.normalizeAdv ? normalize(advantages) : advantages;

	// Refresh the return statistics before using them as the critic's scale.
	updateReturnStats(agent, returns);
	const rStd = returnStd(agent);
	const rMean = agent.retMean;

	const idx = new Int32Array(n);
	for (let i = 0; i < n; i++) idx[i] = i;

	const ratiosAll = [];
	const logRatiosAll = [];
	let policyLossSum = 0;
	let valueLossSum = 0;
	let samples = 0;
	let stoppedEarly = false;
	let epochsRun = 0;

	for (let epoch = 0; epoch < hp.epochs && !stoppedEarly; epoch++) {
		// Fisher–Yates with the trainer's RNG (deterministic given the seed).
		for (let i = n - 1; i > 0; i--) {
			const j = Math.floor(t.rng() * (i + 1));
			const tmp = idx[i];
			idx[i] = idx[j];
			idx[j] = tmp;
		}
		epochsRun++;

		for (let start = 0; start < n; start += hp.minibatch) {
			const end = Math.min(start + hp.minibatch, n);
			const size = end - start;
			const piGrads = zeroGrads(agent.pi);
			const vfGrads = zeroGrads(agent.vf);
			const dLogStd = new Float64Array(ACT_DIM);

			for (let k = start; k < end; k++) {
				const i = idx[k];
				const obs = batch.obsBuf[i];
				const action = batch.actBuf[i];
				const adv = advForLoss[i];

				// --- policy ---
				const piActs = forward(agent.pi, obs);
				const mean = piActs[agent.pi.nLayers];
				const logp = gaussianLogProb(action, mean, agent.logStd);
				const logRatio = logp - batch.logpBuf[i];
				const ratio = Math.exp(logRatio);
				const { objective, dRatio } = clippedSurrogate(ratio, adv, hp.clipEps);

				policyLossSum += -objective;
				ratiosAll.push(ratio);
				logRatiosAll.push(logRatio);

				// d(-objective)/d(logp) = -dRatio * ratio, since ratio = exp(logp - logpOld)
				const dLogp = -dRatio * ratio;

				const dMean = new Float64Array(ACT_DIM);
				for (let d = 0; d < ACT_DIM; d++) {
					const std = Math.exp(agent.logStd[d]);
					const z = (action[d] - mean[d]) / std;
					// d(logp)/d(mean) = z/std ; d(logp)/d(logStd) = z^2 - 1
					dMean[d] = dLogp * (z / std);
					dLogStd[d] += dLogp * (z * z - 1) - hp.entCoef * 1;
				}
				backward(agent.pi, piActs, dMean, piGrads);

				// --- value (regressed in normalized units) ---
				const vfActs = forward(agent.vf, obs);
				const vNorm = vfActs[agent.vf.nLayers][0];
				const target = (returns[i] - rMean) / rStd;
				const err = vNorm - target;
				valueLossSum += 0.5 * err * err;
				backward(agent.vf, vfActs, [hp.vfCoef * err], vfGrads);

				samples++;
			}

			const scale = 1 / size;
			clipGradNorm(piGrads, hp.maxGradNorm / scale);
			clipGradNorm(vfGrads, hp.maxGradNorm / scale);
			adamStep(agent.pi, piGrads, agent.piOpt, hp.lr, scale);
			adamStep(agent.vf, vfGrads, agent.vfOpt, hp.lr, scale);

			// Adam on log-std (entropy coefficient pushes it up, the surrogate
			// pulls it down as the policy sharpens).
			agent.lsT += 1;
			const bc1 = 1 - Math.pow(0.9, agent.lsT);
			const bc2 = 1 - Math.pow(0.999, agent.lsT);
			for (let d = 0; d < ACT_DIM; d++) {
				const g = dLogStd[d] * scale;
				agent.lsM[d] = 0.9 * agent.lsM[d] + 0.1 * g;
				agent.lsV[d] = 0.999 * agent.lsV[d] + 0.001 * g * g;
				agent.logStd[d] -=
					(hp.lr * (agent.lsM[d] / bc1)) /
					(Math.sqrt(agent.lsV[d] / bc2) + 1e-8);
				agent.logStd[d] = Math.max(
					LOG_STD_MIN,
					Math.min(LOG_STD_MAX, agent.logStd[d])
				);
			}
		}

		// Trust-region guard: bail out of further epochs if this update has
		// already moved the policy too far.
		if (hp.targetKL > 0 && approxKL(logRatiosAll) > hp.targetKL * 1.5) {
			stoppedEarly = true;
		}
	}

	t.iteration += 1;

	return {
		policyLoss: policyLossSum / Math.max(1, samples),
		valueLoss: valueLossSum / Math.max(1, samples),
		entropy: gaussianEntropy(agent.logStd),
		approxKL: approxKL(logRatiosAll),
		clipFrac: clipFraction(ratiosAll, hp.clipEps),
		explainedVar: explainedVariance(batch.valBuf, returns),
		logStd: Array.from(agent.logStd),
		epochsRun,
		stoppedEarly,
	};
}

/** Collect + update. Returns the merged stats for one training iteration. */
export function trainIteration(t) {
	const batch = collectRollout(t);
	const diag = update(t, batch);
	if (batch.finishedReturns.length) {
		t.recentReturns.push(...batch.finishedReturns);
		if (t.recentReturns.length > 40) {
			t.recentReturns.splice(0, t.recentReturns.length - 40);
		}
	}
	const meanReturn = t.recentReturns.length
		? t.recentReturns.reduce((a, b) => a + b, 0) / t.recentReturns.length
		: 0;
	return {
		...diag,
		iteration: t.iteration,
		totalSteps: t.totalSteps,
		meanReturn,
		episodes: batch.episodes,
		crashes: batch.crashes,
		crashRate: batch.episodes ? batch.crashes / batch.episodes : 0,
	};
}
