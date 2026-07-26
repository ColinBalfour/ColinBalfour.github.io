import { describe, expect, test } from "vitest";

import { createTrainer, trainIteration, actGreedy, valueOf } from "./trainer";
import { createEnv, mulberry32, reset, step } from "./env";

// Fly the greedy policy for a few episodes and report how it does.
function evaluate(agent, { randomize = false, episodes = 6, seed = 999 } = {}) {
	const rng = mulberry32(seed);
	const env = createEnv({ rng });
	let totalReturn = 0;
	let crashes = 0;
	let finalDist = 0;
	for (let e = 0; e < episodes; e++) {
		let obs = reset(env, { randomize });
		let done = false;
		while (!done) {
			const res = step(env, actGreedy(agent, obs));
			obs = res.obs;
			totalReturn += res.reward;
			done = res.done;
			if (res.crashed) crashes++;
		}
		finalDist += Math.hypot(env.x, env.y);
	}
	return {
		meanReturn: totalReturn / episodes,
		crashRate: crashes / episodes,
		meanFinalDist: finalDist / episodes,
	};
}

describe("PPO training", () => {
	test(
		"learns to hover: return improves and crashes stop",
		() => {
			const t = createTrainer({ randomize: false }, 42);

			const before = evaluate(t.agent);
			let last = null;
			for (let i = 0; i < 70; i++) last = trainIteration(t);
			const after = evaluate(t.agent);

			// The untrained policy should fall out of the sky; the trained one
			// should stay up and end near the goal.
			expect(after.meanReturn).toBeGreaterThan(before.meanReturn);
			expect(after.crashRate).toBeLessThan(0.35);
			expect(after.meanFinalDist).toBeLessThan(before.meanFinalDist);

			// Diagnostics must stay in sane ranges, not just the reward.
			expect(Number.isFinite(last.approxKL)).toBe(true);
			expect(last.approxKL).toBeGreaterThanOrEqual(0);
			expect(last.clipFrac).toBeGreaterThanOrEqual(0);
			expect(last.clipFrac).toBeLessThanOrEqual(1);
			// The critic must actually track the return, not just exist. Value
			// targets reach ~250 here; without return normalization the head
			// underfits by ~7x and this sits at zero.
			expect(last.explainedVar).toBeGreaterThan(0.3);
		},
		120000
	);

	test("is reproducible for a fixed seed", () => {
		const a = createTrainer({ randomize: false }, 7);
		const b = createTrainer({ randomize: false }, 7);
		const sa = trainIteration(a);
		const sb = trainIteration(b);
		expect(sa.meanReturn).toBe(sb.meanReturn);
		expect(sa.approxKL).toBe(sb.approxKL);
	});

	test("a diverging learning rate is visibly worse than a sane one", () => {
		// The demo's whole premise is that hyperparameters matter; make sure
		// that is actually true here and not just narrative.
		const sane = createTrainer({ randomize: false, lr: 3e-4 }, 5);
		const wild = createTrainer({ randomize: false, lr: 0.25 }, 5);
		let sl = null;
		let wl = null;
		for (let i = 0; i < 12; i++) {
			sl = trainIteration(sane);
			wl = trainIteration(wild);
		}
		// A huge step size blows the policy far outside the trust region.
		expect(wl.approxKL).toBeGreaterThan(sl.approxKL);
	}, 60000);
});

describe("return normalization", () => {
	test("the critic is calibrated in reward units", () => {
		// Regression guard for a bug that is easy to reintroduce: if the value
		// head is trained on raw returns (~250) instead of normalized ones, it
		// underfits badly and every advantage is mis-scaled.
		const t = createTrainer({ randomize: false }, 42);
		for (let i = 0; i < 80; i++) trainIteration(t);

		const rng = mulberry32(5);
		const env = createEnv({ rng });
		let obs = reset(env, { randomize: false });
		const predicted = valueOf(t.agent, obs);

		let actual = 0;
		let disc = 1;
		let done = false;
		while (!done) {
			const res = step(env, actGreedy(t.agent, obs));
			actual += disc * res.reward;
			disc *= t.hp.gamma;
			obs = res.obs;
			done = res.done;
		}
		// Within 30% of the realised discounted return.
		expect(Math.abs(predicted - actual) / Math.abs(actual)).toBeLessThan(0.3);
	}, 200000);
});
