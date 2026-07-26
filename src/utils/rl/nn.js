// A minimal MLP with hand-written backprop and Adam — no ML framework, so the
// whole training loop runs in the browser with zero download.
//
// Layers are tanh except the output, which is linear. Correctness of the
// backward pass is pinned by a finite-difference gradient check in the tests
// (nn.test.js); that check is the reason this is trustworthy rather than
// "it seems to learn".

export function createMLP(sizes, rng, outGain = 1.0) {
	const W = [];
	const b = [];
	for (let i = 0; i < sizes.length - 1; i++) {
		const fanIn = sizes[i];
		const fanOut = sizes[i + 1];
		const isLast = i === sizes.length - 2;
		// tanh nets like ~1/sqrt(fanIn); the policy head is initialised small
		// so the first actions sit near hover instead of saturating the rotors.
		const scale = (isLast ? outGain : 1.0) / Math.sqrt(fanIn);
		const w = new Float64Array(fanOut * fanIn);
		for (let k = 0; k < w.length; k++) w[k] = (rng() * 2 - 1) * scale;
		W.push(w);
		b.push(new Float64Array(fanOut));
	}
	return { sizes, W, b, nLayers: sizes.length - 1 };
}

export function zeroGrads(mlp) {
	return {
		W: mlp.W.map((w) => new Float64Array(w.length)),
		b: mlp.b.map((v) => new Float64Array(v.length)),
	};
}

// Returns the activation of every layer; acts[i] is the *input* to layer i,
// acts[nLayers] is the network output.
export function forward(mlp, x) {
	const acts = [Float64Array.from(x)];
	let a = acts[0];
	for (let i = 0; i < mlp.nLayers; i++) {
		const inDim = mlp.sizes[i];
		const outDim = mlp.sizes[i + 1];
		const W = mlp.W[i];
		const b = mlp.b[i];
		const out = new Float64Array(outDim);
		for (let o = 0; o < outDim; o++) {
			let s = b[o];
			const row = o * inDim;
			for (let j = 0; j < inDim; j++) s += W[row + j] * a[j];
			// Linear output layer; tanh everywhere else.
			out[o] = i === mlp.nLayers - 1 ? s : Math.tanh(s);
		}
		acts.push(out);
		a = out;
	}
	return acts;
}

// Accumulates dLoss/dW and dLoss/db into `grads` for one sample.
export function backward(mlp, acts, dOut, grads) {
	let d = Float64Array.from(dOut);
	for (let i = mlp.nLayers - 1; i >= 0; i--) {
		const inDim = mlp.sizes[i];
		const outDim = mlp.sizes[i + 1];
		const aIn = acts[i];
		const gW = grads.W[i];
		const gb = grads.b[i];
		for (let o = 0; o < outDim; o++) {
			const dO = d[o];
			if (dO === 0) continue;
			gb[o] += dO;
			const row = o * inDim;
			for (let j = 0; j < inDim; j++) gW[row + j] += dO * aIn[j];
		}
		if (i === 0) break;
		// Propagate through the previous layer's tanh: d/dz = 1 - tanh(z)^2.
		const W = mlp.W[i];
		const dPrev = new Float64Array(inDim);
		for (let j = 0; j < inDim; j++) {
			let s = 0;
			for (let o = 0; o < outDim; o++) s += W[o * inDim + j] * d[o];
			dPrev[j] = s * (1 - aIn[j] * aIn[j]);
		}
		d = dPrev;
	}
	return d;
}

export function createAdam(mlp) {
	return {
		mW: mlp.W.map((w) => new Float64Array(w.length)),
		vW: mlp.W.map((w) => new Float64Array(w.length)),
		mb: mlp.b.map((v) => new Float64Array(v.length)),
		vb: mlp.b.map((v) => new Float64Array(v.length)),
		t: 0,
	};
}

// Global-norm gradient clipping, as in the reference PPO implementations —
// without it a single bad batch can blow the policy up.
export function clipGradNorm(grads, maxNorm) {
	let sq = 0;
	for (const g of grads.W) for (let i = 0; i < g.length; i++) sq += g[i] * g[i];
	for (const g of grads.b) for (let i = 0; i < g.length; i++) sq += g[i] * g[i];
	const norm = Math.sqrt(sq);
	if (norm > maxNorm && norm > 0) {
		const s = maxNorm / norm;
		for (const g of grads.W) for (let i = 0; i < g.length; i++) g[i] *= s;
		for (const g of grads.b) for (let i = 0; i < g.length; i++) g[i] *= s;
	}
	return norm;
}

export function adamStep(mlp, grads, opt, lr, scale = 1, b1 = 0.9, b2 = 0.999, eps = 1e-8) {
	opt.t += 1;
	const bc1 = 1 - Math.pow(b1, opt.t);
	const bc2 = 1 - Math.pow(b2, opt.t);
	const apply = (params, gs, ms, vs) => {
		for (let i = 0; i < params.length; i++) {
			const p = params[i];
			const g = gs[i];
			const m = ms[i];
			const v = vs[i];
			for (let k = 0; k < p.length; k++) {
				const gk = g[k] * scale;
				m[k] = b1 * m[k] + (1 - b1) * gk;
				v[k] = b2 * v[k] + (1 - b2) * gk * gk;
				p[k] -= (lr * (m[k] / bc1)) / (Math.sqrt(v[k] / bc2) + eps);
			}
		}
	};
	apply(mlp.W, grads.W, opt.mW, opt.vW);
	apply(mlp.b, grads.b, opt.mb, opt.vb);
}
