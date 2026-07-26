import { describe, expect, test } from "vitest";

import {
	DEFAULTS,
	OBS_DIM,
	createEnv,
	mulberry32,
	observe,
	reset,
	setDisturbance,
	step,
} from "./env";

const mkEnv = (seed = 1) => createEnv({ rng: mulberry32(seed) });
const hover = [0, 0]; // a = 0 is the hover command

describe("environment basics", () => {
	test("observation has the declared dimension", () => {
		const env = mkEnv();
		expect(observe(env).length).toBe(OBS_DIM);
		expect(reset(env, { randomize: false }).length).toBe(OBS_DIM);
	});

	test("a = 0 holds altitude at zero tilt", () => {
		const env = mkEnv();
		reset(env, { randomize: false });
		env.x = 0; env.y = 0; env.vx = 0; env.vy = 0; env.th = 0; env.om = 0;
		step(env, hover);
		expect(Math.abs(env.vy)).toBeLessThan(1e-9);
	});

	test("differential thrust produces torque, collective does not", () => {
		const spin = mkEnv();
		reset(spin, { randomize: false });
		spin.th = 0; spin.om = 0;
		step(spin, [1, -1]);
		expect(Math.abs(spin.om)).toBeGreaterThan(0.1);

		const level = mkEnv();
		reset(level, { randomize: false });
		level.th = 0; level.om = 0;
		step(level, [1, 1]);
		expect(Math.abs(level.om)).toBeLessThan(1e-9);
	});

	test("per-step reward is non-negative across the reachable envelope", () => {
		// The invariant that stops "crash early" from being optimal.
		const env = mkEnv();
		reset(env, { randomize: false });
		for (const d of [0, 1, 2, 3, 3.4]) {
			for (const th of [0, 0.5, 1.0, 1.29]) {
				env.x = d; env.y = 0; env.vx = 0; env.vy = 0;
				env.th = th; env.om = 0;
				const { reward } = step(env, hover);
				expect(reward).toBeGreaterThan(0);
			}
		}
	});
});

describe("integral error state", () => {
	test("accumulates position error and is clamped for anti-windup", () => {
		const env = mkEnv();
		reset(env, { randomize: false });
		expect(env.ix).toBe(0);

		// Pin the robot off-centre and let the integral build.
		for (let i = 0; i < 2000; i++) {
			env.x = 2;
			step(env, hover);
		}
		expect(Math.abs(env.ix)).toBeGreaterThan(0.5);
		expect(Math.abs(env.ix)).toBeLessThanOrEqual(3.0 + 1e-9);
	});

	test("reset clears it", () => {
		const env = mkEnv();
		reset(env, { randomize: false });
		for (let i = 0; i < 50; i++) { env.x = 2; step(env, hover); }
		reset(env, { randomize: false });
		expect(env.ix).toBe(0);
		expect(env.iy).toBe(0);
	});
});

describe("domain randomization", () => {
	const spread = (drScale, key, n = 60) => {
		const env = mkEnv(7);
		const vals = [];
		for (let i = 0; i < n; i++) {
			reset(env, { randomize: drScale > 0, drScale });
			vals.push(env[key]);
		}
		return Math.max(...vals) - Math.min(...vals);
	};

	test("off by default: the nominal model is exact", () => {
		const env = mkEnv();
		reset(env, { randomize: false });
		expect(env.mass).toBe(DEFAULTS.mass);
		expect(env.thrustScale).toBe(1);
		expect(env.windX).toBe(0);
		expect(env.obsNoise).toBe(0);
		expect(env.drScale).toBe(0);
	});

	test("scale widens the spread of every randomized parameter", () => {
		for (const key of ["mass", "thrustScale", "windX"]) {
			expect(spread(1.5, key)).toBeGreaterThan(spread(0.5, key));
		}
	});

	test("sampled airframes stay flyable regardless of scale", () => {
		// A heavy body paired with weak rotors would make the episode
		// unwinnable, which teaches nothing and just adds return variance.
		const env = mkEnv(11);
		for (let i = 0; i < 300; i++) {
			reset(env, { randomize: true, drScale: 1.5 });
			const maxLift = 2 * env.cfg.maxThrust * env.thrustScale;
			expect(maxLift / (env.mass * env.cfg.g)).toBeGreaterThan(1.4);
			expect(env.mass).toBeGreaterThan(0);
		}
	});

	test("transient gusts fire while randomizing, never when nominal", () => {
		const on = mkEnv(3);
		reset(on, { randomize: true, drScale: 1 });
		let gusty = 0;
		for (let i = 0; i < 4000; i++) {
			step(on, hover);
			if (on.gustX !== 0 || on.gustY !== 0) gusty++;
			if (on.done) reset(on, { randomize: true, drScale: 1 });
		}
		expect(gusty).toBeGreaterThan(0);

		const off = mkEnv(3);
		reset(off, { randomize: false });
		for (let i = 0; i < 2000; i++) {
			step(off, hover);
			expect(off.gustX).toBe(0);
			if (off.done) reset(off, { randomize: false });
		}
	});
});

describe("run-time disturbance", () => {
	test("is independent of the training wind and pushes the body", () => {
		const env = mkEnv();
		reset(env, { randomize: false });
		env.x = 0; env.y = 0; env.vx = 0; env.vy = 0; env.th = 0; env.om = 0;
		setDisturbance(env, 5, 0);
		step(env, hover);
		expect(env.vx).toBeGreaterThan(0);
		// It is not wind: reset must clear it, leaving the model nominal.
		reset(env, { randomize: false });
		expect(env.extForceX).toBe(0);
	});
});
