// PPO maths, kept as pure functions so every piece is unit-testable:
// Gaussian policy likelihood, GAE(lambda), the clipped surrogate and its
// gradient, and the diagnostics an RL practitioner actually reads
// (approx-KL, clip fraction, explained variance).

const LOG_2PI = Math.log(2 * Math.PI);

// ---- Gaussian policy -------------------------------------------------

export function gaussianLogProb(action, mean, logStd) {
	let lp = 0;
	for (let i = 0; i < action.length; i++) {
		const std = Math.exp(logStd[i]);
		const z = (action[i] - mean[i]) / std;
		lp += -0.5 * z * z - logStd[i] - 0.5 * LOG_2PI;
	}
	return lp;
}

// Differential entropy of a diagonal Gaussian: sum(logStd) + k/2 * log(2*pi*e)
export function gaussianEntropy(logStd) {
	let h = 0;
	for (let i = 0; i < logStd.length; i++) {
		h += logStd[i] + 0.5 * (LOG_2PI + 1);
	}
	return h;
}

export function sampleGaussian(mean, logStd, rng) {
	const a = new Float32Array(mean.length);
	for (let i = 0; i < mean.length; i++) {
		// Box–Muller
		let u = 0;
		let v = 0;
		while (u === 0) u = rng();
		while (v === 0) v = rng();
		const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
		a[i] = mean[i] + Math.exp(logStd[i]) * n;
	}
	return a;
}

// ---- Advantage estimation --------------------------------------------

/**
 * Generalized Advantage Estimation.
 *
 * `nextValues[t]` must already encode bootstrapping: 0 where the episode truly
 * terminated (a crash), V(s_{t+1}) where it merely hit the time limit. Getting
 * that distinction wrong silently teaches the agent that running out of clock
 * is as bad as crashing.
 */
export function computeGAE(rewards, values, nextValues, dones, gamma, lam) {
	const n = rewards.length;
	const adv = new Float64Array(n);
	const ret = new Float64Array(n);
	let running = 0;
	for (let t = n - 1; t >= 0; t--) {
		const delta = rewards[t] + gamma * nextValues[t] - values[t];
		// Advantages don't propagate across an episode boundary.
		running = delta + (dones[t] ? 0 : gamma * lam * running);
		adv[t] = running;
		ret[t] = running + values[t];
	}
	return { advantages: adv, returns: ret };
}

export function normalize(arr, eps = 1e-8) {
	const n = arr.length;
	if (n === 0) return new Float64Array(0);
	let mean = 0;
	for (let i = 0; i < n; i++) mean += arr[i];
	mean /= n;
	let varSum = 0;
	for (let i = 0; i < n; i++) {
		const d = arr[i] - mean;
		varSum += d * d;
	}
	const std = Math.sqrt(varSum / n);
	const out = new Float64Array(n);
	for (let i = 0; i < n; i++) out[i] = (arr[i] - mean) / (std + eps);
	return out;
}

// ---- Clipped surrogate ------------------------------------------------

/**
 * PPO's clipped objective for one sample.
 *
 * Returns the objective (to maximise) plus d(objective)/d(ratio). Where the
 * clip binds, that derivative is exactly zero — that is the entire mechanism
 * stopping the update from walking outside the trust region.
 */
export function clippedSurrogate(ratio, advantage, clipEps) {
	const s1 = ratio * advantage;
	const clippedRatio = Math.min(Math.max(ratio, 1 - clipEps), 1 + clipEps);
	const s2 = clippedRatio * advantage;
	const takeS1 = s1 <= s2;
	return {
		objective: takeS1 ? s1 : s2,
		dRatio: takeS1 ? advantage : 0,
		clipped: !takeS1,
	};
}

// ---- Diagnostics ------------------------------------------------------

// Schulman's k3 estimator: low-variance and, unlike mean(logpOld - logp),
// never negative — so it can be compared against a target KL.
export function approxKL(logRatios) {
	let s = 0;
	for (let i = 0; i < logRatios.length; i++) {
		const lr = logRatios[i];
		s += Math.exp(lr) - 1 - lr;
	}
	return logRatios.length ? s / logRatios.length : 0;
}

export function clipFraction(ratios, clipEps) {
	let c = 0;
	for (let i = 0; i < ratios.length; i++) {
		if (Math.abs(ratios[i] - 1) > clipEps) c++;
	}
	return ratios.length ? c / ratios.length : 0;
}

// 1 - Var(residual)/Var(returns). ~0 means the critic is no better than
// predicting the mean; <0 means it is actively worse.
export function explainedVariance(values, returns) {
	const n = returns.length;
	if (n === 0) return 0;
	let mR = 0;
	for (let i = 0; i < n; i++) mR += returns[i];
	mR /= n;
	let varR = 0;
	let varRes = 0;
	let mRes = 0;
	for (let i = 0; i < n; i++) mRes += returns[i] - values[i];
	mRes /= n;
	for (let i = 0; i < n; i++) {
		const dR = returns[i] - mR;
		varR += dR * dR;
		const dRes = returns[i] - values[i] - mRes;
		varRes += dRes * dRes;
	}
	if (varR === 0) return 0;
	return 1 - varRes / varR;
}
