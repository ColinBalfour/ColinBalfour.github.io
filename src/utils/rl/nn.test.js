import { describe, expect, test } from "vitest";

import {
	adamStep,
	backward,
	clipGradNorm,
	createAdam,
	createMLP,
	forward,
	zeroGrads,
} from "./nn";
import { mulberry32 } from "./env";

// Squared-error loss on the network output, and its gradient wrt the output.
function lossAndDOut(out, target) {
	let loss = 0;
	const d = new Float64Array(out.length);
	for (let i = 0; i < out.length; i++) {
		const e = out[i] - target[i];
		loss += 0.5 * e * e;
		d[i] = e;
	}
	return { loss, d };
}

function lossOf(mlp, xs, targets) {
	let total = 0;
	for (let s = 0; s < xs.length; s++) {
		const acts = forward(mlp, xs[s]);
		total += lossAndDOut(acts[mlp.nLayers], targets[s]).loss;
	}
	return total;
}

describe("MLP backprop", () => {
	// The load-bearing test: compare every analytic gradient against a central
	// finite difference. If backprop is wrong anywhere, this fails.
	test("analytic gradients match finite differences", () => {
		const rng = mulberry32(7);
		const mlp = createMLP([4, 6, 5, 3], rng, 1.0);

		const xs = [
			[0.3, -0.7, 1.1, 0.2],
			[-1.2, 0.4, 0.05, -0.9],
			[0.8, 0.9, -0.3, 0.6],
		];
		const targets = [
			[0.5, -0.2, 0.1],
			[-0.3, 0.7, 0.4],
			[0.2, 0.2, -0.6],
		];

		// Analytic gradients over the batch.
		const grads = zeroGrads(mlp);
		for (let s = 0; s < xs.length; s++) {
			const acts = forward(mlp, xs[s]);
			const { d } = lossAndDOut(acts[mlp.nLayers], targets[s]);
			backward(mlp, acts, d, grads);
		}

		const h = 1e-6;
		let checked = 0;
		for (let layer = 0; layer < mlp.nLayers; layer++) {
			// Sample a spread of weights in each layer rather than all of them.
			for (let k = 0; k < mlp.W[layer].length; k += 3) {
				const orig = mlp.W[layer][k];
				mlp.W[layer][k] = orig + h;
				const lp = lossOf(mlp, xs, targets);
				mlp.W[layer][k] = orig - h;
				const lm = lossOf(mlp, xs, targets);
				mlp.W[layer][k] = orig;

				const numeric = (lp - lm) / (2 * h);
				const analytic = grads.W[layer][k];
				expect(Math.abs(numeric - analytic)).toBeLessThan(
					1e-5 + 1e-4 * Math.abs(numeric)
				);
				checked++;
			}
			// And every bias.
			for (let k = 0; k < mlp.b[layer].length; k++) {
				const orig = mlp.b[layer][k];
				mlp.b[layer][k] = orig + h;
				const lp = lossOf(mlp, xs, targets);
				mlp.b[layer][k] = orig - h;
				const lm = lossOf(mlp, xs, targets);
				mlp.b[layer][k] = orig;

				const numeric = (lp - lm) / (2 * h);
				expect(Math.abs(numeric - grads.b[layer][k])).toBeLessThan(
					1e-5 + 1e-4 * Math.abs(numeric)
				);
				checked++;
			}
		}
		expect(checked).toBeGreaterThan(30);
	});

	test("forward is deterministic and shaped correctly", () => {
		const mlp = createMLP([3, 5, 2], mulberry32(1));
		const a = forward(mlp, [0.1, 0.2, 0.3]);
		const b = forward(mlp, [0.1, 0.2, 0.3]);
		expect(a[mlp.nLayers].length).toBe(2);
		expect(Array.from(a[mlp.nLayers])).toEqual(Array.from(b[mlp.nLayers]));
	});

	test("hidden layers are tanh-bounded, output layer is not", () => {
		const mlp = createMLP([2, 8, 1], mulberry32(3));
		// Drive the net hard; hidden activations must stay inside (-1, 1).
		const acts = forward(mlp, [50, -50]);
		for (const v of acts[1]) expect(Math.abs(v)).toBeLessThanOrEqual(1);
	});

	test("gradient descent actually reduces the loss", () => {
		const rng = mulberry32(11);
		const mlp = createMLP([3, 16, 2], rng);
		const opt = createAdam(mlp);
		const xs = [
			[0.5, -0.5, 0.25],
			[-0.8, 0.3, 0.9],
		];
		const targets = [
			[1, -1],
			[-1, 1],
		];
		const before = lossOf(mlp, xs, targets);
		for (let it = 0; it < 200; it++) {
			const grads = zeroGrads(mlp);
			for (let s = 0; s < xs.length; s++) {
				const acts = forward(mlp, xs[s]);
				const { d } = lossAndDOut(acts[mlp.nLayers], targets[s]);
				backward(mlp, acts, d, grads);
			}
			adamStep(mlp, grads, opt, 0.02, 1 / xs.length);
		}
		expect(lossOf(mlp, xs, targets)).toBeLessThan(before * 0.05);
	});
});

describe("gradient clipping", () => {
	test("rescales to the max norm and reports the original", () => {
		const mlp = createMLP([2, 2, 1], mulberry32(5));
		const grads = zeroGrads(mlp);
		grads.W[0][0] = 3;
		grads.W[0][1] = 4; // norm 5 so far
		const norm = clipGradNorm(grads, 1);
		expect(norm).toBeCloseTo(5, 6);
		expect(grads.W[0][0]).toBeCloseTo(0.6, 6);
		expect(grads.W[0][1]).toBeCloseTo(0.8, 6);
	});

	test("leaves gradients under the threshold untouched", () => {
		const mlp = createMLP([2, 2, 1], mulberry32(5));
		const grads = zeroGrads(mlp);
		grads.W[0][0] = 0.3;
		clipGradNorm(grads, 10);
		expect(grads.W[0][0]).toBeCloseTo(0.3, 9);
	});
});
