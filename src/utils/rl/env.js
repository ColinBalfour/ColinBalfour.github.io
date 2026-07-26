// A planar (2D) quadrotor, written as a pure module so the physics and the
// reward can be unit-tested independently of the training loop or the UI.
//
// The robot has two rotors on a rigid arm. Each action component sets one
// rotor's thrust, so the agent has to learn that *differential* thrust rotates
// the body while *collective* thrust fights gravity — it cannot translate
// without first tilting, which is what makes this a real control problem
// rather than a point mass with a velocity command.
//
// Domain randomization is part of the environment rather than bolted on: each
// episode can resample mass, thrust authority, wind, actuator latency and
// sensor noise. Training with those enabled is what buys robustness to the
// disturbances a user can inject at run time.

// Deterministic PRNG so episodes/tests are reproducible.
export function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export const OBS_DIM = 7;
export const ACT_DIM = 2;

export const DEFAULTS = {
	dt: 0.03,
	g: 9.81,
	mass: 1.0,
	// Sized so the body needs ~14 control steps to flip past maxTilt. At the
	// original 0.02 it flipped in ~5 steps, which is unlearnable at this rate.
	inertia: 0.1,
	arm: 0.15,
	// Each rotor can produce up to one body-weight of thrust, so a=0 hovers.
	maxThrust: 9.81,
	maxSteps: 300,
	bound: 3.5, // metres from goal before the episode is abandoned
	maxTilt: 1.3, // radians before we call it a crash
	// Domain randomization ranges (only applied when randomize = true).
	dr: {
		massRange: [0.75, 1.35],
		thrustRange: [0.85, 1.15],
		windRange: 2.2, // metres/second^2 of constant acceleration
		maxLatency: 2, // control steps of actuator delay
		obsNoise: 0.02,
	},
};

function gaussian(rng) {
	// Box–Muller; adequate for sensor noise.
	let u = 0;
	let v = 0;
	while (u === 0) u = rng();
	while (v === 0) v = rng();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function createEnv(options = {}) {
	const cfg = { ...DEFAULTS, ...options, dr: { ...DEFAULTS.dr, ...(options.dr || {}) } };
	return {
		cfg,
		rng: options.rng || mulberry32(1234),
		// Physical state.
		x: 0, y: 0, vx: 0, vy: 0, th: 0, om: 0,
		// Per-episode parameters (resampled by reset when randomizing).
		mass: cfg.mass,
		thrustScale: 1,
		windX: 0,
		windY: 0,
		latency: 0,
		obsNoise: 0,
		// External disturbance the *user* applies at run time (not training).
		extForceX: 0,
		extForceY: 0,
		actionQueue: [],
		steps: 0,
		done: false,
	};
}

export function reset(env, { randomize = false } = {}) {
	const { cfg, rng } = env;

	// Start displaced from the goal with some initial motion, so the policy
	// has to actually fly rather than memorise a fixed trajectory.
	env.x = (rng() * 2 - 1) * 1.6;
	env.y = (rng() * 2 - 1) * 1.2;
	env.vx = (rng() * 2 - 1) * 0.6;
	env.vy = (rng() * 2 - 1) * 0.6;
	env.th = (rng() * 2 - 1) * 0.25;
	env.om = (rng() * 2 - 1) * 0.4;

	if (randomize) {
		const d = cfg.dr;
		env.mass = cfg.mass * (d.massRange[0] + rng() * (d.massRange[1] - d.massRange[0]));
		env.thrustScale = d.thrustRange[0] + rng() * (d.thrustRange[1] - d.thrustRange[0]);
		env.windX = (rng() * 2 - 1) * d.windRange;
		env.windY = (rng() * 2 - 1) * d.windRange * 0.5;
		env.latency = Math.floor(rng() * (d.maxLatency + 1));
		env.obsNoise = d.obsNoise;
	} else {
		env.mass = cfg.mass;
		env.thrustScale = 1;
		env.windX = 0;
		env.windY = 0;
		env.latency = 0;
		env.obsNoise = 0;
	}

	env.actionQueue = [];
	env.extForceX = 0;
	env.extForceY = 0;
	env.steps = 0;
	env.done = false;
	return observe(env);
}

export function observe(env) {
	const n = env.obsNoise;
	const rng = env.rng;
	const jitter = n > 0 ? () => gaussian(rng) * n : () => 0;
	return [
		-env.x / 2 + jitter(), // goal-relative position (goal is the origin)
		-env.y / 2 + jitter(),
		env.vx / 3 + jitter(),
		env.vy / 3 + jitter(),
		Math.sin(env.th) + jitter(),
		Math.cos(env.th) + jitter(),
		env.om / 5 + jitter(),
	];
}

// Reward: stay near the goal, upright, calm, and don't slam the motors.
//
// The shaping terms are bounded Gaussians rather than linear penalties, which
// matters more than it looks. A linear -k*distance makes the per-step reward
// negative far from the goal, and since a crash merely ends the episode, the
// agent discovers that dying immediately beats living with a negative income —
// it learns to crash faster, not fly better. Keeping every term non-negative
// means survival always dominates, and the crash penalty is what it appears
// to be rather than a mercy.
export function reward(env, action) {
	const dist = Math.hypot(env.x, env.y);
	const speed = Math.hypot(env.vx, env.vy);
	const effort = action[0] * action[0] + action[1] * action[1];
	const atGoal = 2.0 * Math.exp(-0.8 * dist * dist);
	const upright = 0.6 * Math.exp(-3 * env.th * env.th);
	const calm = 0.4 * Math.exp(-0.5 * speed * speed);
	return atGoal + upright + calm - 0.02 * Math.abs(env.om) - 0.005 * effort;
}

export function step(env, actionRaw) {
	const { cfg } = env;

	// Clamp, then push through the actuator-latency buffer.
	const a = [
		Math.max(-1, Math.min(1, actionRaw[0])),
		Math.max(-1, Math.min(1, actionRaw[1])),
	];
	env.actionQueue.push(a);
	const applied =
		env.actionQueue.length > env.latency
			? env.actionQueue.shift()
			: [0, 0];

	// Map [-1,1] to [0, maxThrust] per rotor, so a = 0 is a hover command.
	const t0 = ((applied[0] + 1) / 2) * cfg.maxThrust * env.thrustScale;
	const t1 = ((applied[1] + 1) / 2) * cfg.maxThrust * env.thrustScale;
	const T = t0 + t1;
	const torque = (t0 - t1) * cfg.arm;

	const ax = (-T * Math.sin(env.th) + env.windX + env.extForceX) / env.mass;
	const ay =
		(T * Math.cos(env.th) + env.windY + env.extForceY) / env.mass - cfg.g;
	const alpha = torque / cfg.inertia;

	// Semi-implicit Euler: integrate velocity first, then position.
	const dt = cfg.dt;
	env.vx += ax * dt;
	env.vy += ay * dt;
	env.om += alpha * dt;
	env.x += env.vx * dt;
	env.y += env.vy * dt;
	env.th += env.om * dt;

	env.steps += 1;

	const r = reward(env, applied);
	const crashed =
		Math.hypot(env.x, env.y) > cfg.bound ||
		Math.abs(env.th) > cfg.maxTilt;
	const truncated = env.steps >= cfg.maxSteps;
	env.done = crashed || truncated;

	return {
		obs: observe(env),
		reward: crashed ? r - 10 : r, // explicit penalty for leaving the envelope
		done: env.done,
		crashed,
		// Distinguish "ran out of clock" from "failed": the value function
		// should bootstrap through truncation but not through a crash.
		truncated: truncated && !crashed,
	};
}

// Run-time disturbance (the cursor "gust"). Separate from wind so that a user
// can push the robot around without touching the training distribution.
export function setDisturbance(env, fx, fy) {
	env.extForceX = fx;
	env.extForceY = fy;
}
