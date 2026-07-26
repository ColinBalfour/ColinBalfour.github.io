import { describe, expect, test } from "vitest";

import {
	approxKL,
	clipFraction,
	clippedSurrogate,
	computeGAE,
	explainedVariance,
	gaussianEntropy,
	gaussianLogProb,
	normalize,
} from "./ppo";

describe("Gaussian policy", () => {
	test("log-prob matches the closed form for a unit Gaussian", () => {
		// log N(0; 0, 1) = -0.5*log(2*pi)
		expect(gaussianLogProb([0], [0], [0])).toBeCloseTo(-0.9189385, 6);
		// One standard deviation out costs an extra 0.5.
		expect(gaussianLogProb([1], [0], [0])).toBeCloseTo(-1.4189385, 6);
		// Independent dims add.
		expect(gaussianLogProb([0, 0], [0, 0], [0, 0])).toBeCloseTo(-1.837877, 6);
	});

	test("log-prob accounts for scale", () => {
		const logStd = [Math.log(2)];
		// log N(0; 0, 2) = -log(2) - 0.5*log(2*pi)
		expect(gaussianLogProb([0], [0], logStd)).toBeCloseTo(
			-Math.log(2) - 0.9189385,
			6
		);
	});

	test("entropy grows with log-std", () => {
		expect(gaussianEntropy([0])).toBeCloseTo(1.4189385, 6);
		expect(gaussianEntropy([0, 0])).toBeCloseTo(2.837877, 6);
		expect(gaussianEntropy([1])).toBeGreaterThan(gaussianEntropy([0]));
	});
});

describe("GAE(lambda)", () => {
	const rewards = [1, 1, 1];
	const values = [0, 0, 0];
	const nextValues = [0, 0, 0];
	const dones = [false, false, true];

	test("lambda = 1 reduces to the Monte-Carlo return", () => {
		const { advantages } = computeGAE(rewards, values, nextValues, dones, 1, 1);
		expect(Array.from(advantages)).toEqual([3, 2, 1]);
	});

	test("lambda = 0 reduces to the one-step TD error", () => {
		const { advantages } = computeGAE(rewards, values, nextValues, dones, 1, 0);
		expect(Array.from(advantages)).toEqual([1, 1, 1]);
	});

	test("returns are advantages plus the baseline", () => {
		const v = [0.5, -0.25, 2];
		const { advantages, returns } = computeGAE(rewards, v, nextValues, dones, 0.99, 0.95);
		for (let i = 0; i < 3; i++) {
			expect(returns[i]).toBeCloseTo(advantages[i] + v[i], 9);
		}
	});

	test("credit does not leak across an episode boundary", () => {
		// Two 2-step episodes. The reward in the second must not raise the
		// advantage of the last step of the first.
		const r = [0, 0, 0, 10];
		const zeros = [0, 0, 0, 0];
		const boundaries = [false, true, false, true];
		const { advantages } = computeGAE(r, zeros, zeros, boundaries, 1, 1);
		expect(advantages[1]).toBe(0); // end of episode one: sees nothing after it
		expect(advantages[0]).toBe(0);
		expect(advantages[3]).toBe(10);
		expect(advantages[2]).toBe(10);
	});

	test("bootstraps through a time-limit but not through a crash", () => {
		// Same transition, differing only in whether the future was cut off
		// artificially (truncation -> bootstrap V) or genuinely (terminal -> 0).
		const truncated = computeGAE([1], [0], [10], [true], 1, 1).advantages[0];
		const terminal = computeGAE([1], [0], [0], [true], 1, 1).advantages[0];
		expect(truncated).toBe(11);
		expect(terminal).toBe(1);
	});
});

describe("advantage normalization", () => {
	test("produces zero mean and unit variance", () => {
		const out = normalize([1, 2, 3, 4, 100]);
		let mean = 0;
		for (const v of out) mean += v;
		mean /= out.length;
		let varS = 0;
		for (const v of out) varS += (v - mean) * (v - mean);
		expect(mean).toBeCloseTo(0, 9);
		expect(Math.sqrt(varS / out.length)).toBeCloseTo(1, 6);
	});

	test("does not divide by zero on a constant batch", () => {
		const out = normalize([5, 5, 5]);
		for (const v of out) expect(Number.isFinite(v)).toBe(true);
	});
});

describe("clipped surrogate", () => {
	const eps = 0.2;

	test("passes the gradient through inside the trust region", () => {
		const r = clippedSurrogate(1.0, 2, eps);
		expect(r.objective).toBeCloseTo(2, 9);
		expect(r.dRatio).toBe(2);
		expect(r.clipped).toBe(false);
	});

	test("clips an over-eager step on a good action", () => {
		// ratio 1.5 with positive advantage: capped at 1+eps, no gradient.
		const r = clippedSurrogate(1.5, 2, eps);
		expect(r.objective).toBeCloseTo(2.4, 9);
		expect(r.dRatio).toBe(0);
		expect(r.clipped).toBe(true);
	});

	test("clips an over-eager step away from a bad action", () => {
		const r = clippedSurrogate(0.5, -2, eps);
		expect(r.objective).toBeCloseTo(-1.6, 9);
		expect(r.dRatio).toBe(0);
		expect(r.clipped).toBe(true);
	});

	// The asymmetry that makes PPO work: clipping only removes the incentive to
	// keep going in a direction already taken too far. Moving the *wrong* way
	// stays penalised, so the gradient must survive.
	test("keeps the gradient when the ratio moved the wrong way", () => {
		const worseOnBad = clippedSurrogate(1.5, -2, eps);
		expect(worseOnBad.dRatio).toBe(-2);
		expect(worseOnBad.clipped).toBe(false);

		const worseOnGood = clippedSurrogate(0.5, 2, eps);
		expect(worseOnGood.dRatio).toBe(2);
		expect(worseOnGood.clipped).toBe(false);
	});
});

describe("diagnostics", () => {
	test("approx-KL is zero for an unchanged policy and positive otherwise", () => {
		expect(approxKL([0, 0, 0])).toBeCloseTo(0, 12);
		expect(approxKL([0.3, -0.3])).toBeGreaterThan(0);
		// The k3 estimator is non-negative even when log-ratios are negative.
		expect(approxKL([-0.5, -0.4, -0.6])).toBeGreaterThan(0);
	});

	test("clip fraction counts samples outside the band", () => {
		expect(clipFraction([1, 1.1, 1.5, 0.5], 0.2)).toBeCloseTo(0.5, 9);
		expect(clipFraction([1, 1, 1], 0.2)).toBe(0);
	});

	test("explained variance is 1 for a perfect critic and 0 for the mean", () => {
		const returns = [1, 2, 3, 4];
		expect(explainedVariance(returns, returns)).toBeCloseTo(1, 9);
		expect(explainedVariance([2.5, 2.5, 2.5, 2.5], returns)).toBeCloseTo(0, 9);
	});

	test("explained variance goes negative for a critic worse than the mean", () => {
		expect(explainedVariance([10, -10, 10, -10], [1, 2, 3, 4])).toBeLessThan(0);
	});
});
