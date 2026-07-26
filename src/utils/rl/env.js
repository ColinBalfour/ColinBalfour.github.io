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

export const OBS_DIM = 9;
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
	// Domain randomization, expressed as deviations that get multiplied by
	// `drScale` (the UI slider). Scale 0 = nominal, 1 = default, 2 = brutal.
	//
	// These are sized against body weight (m*g = 9.81 N), because the whole
	// point is to cover the disturbance a user can apply at run time. The
	// first version capped wind at 2.2 N — 0.22 body weights — while the
	// cursor could deliver 24 N. Training never came close to the test
	// condition, so randomization "worked" and bought no robustness at all.
	dr: {
		massDev: 0.3, // mass in 1 +/- 0.3*scale
		thrustDev: 0.15, // rotor authority in 1 +/- 0.15*scale
		// Sustained force is capped well under the ~20 N that becomes
		// infeasible (see clampFeasible / the tilt-vs-thrust budget): an
		// unwinnable episode teaches nothing and just adds return variance.
		windMax: 5, // N, constant for the episode
		gustMax: 8, // N, transient (see below)
		gustProb: 0.014, // per-step chance of a gust starting
		gustLen: [8, 34], // steps a gust lasts
		// 3 steps was punishing: the body only needs ~14 steps to flip, so a
		// 90ms control delay eats a large slice of the recovery window.
		maxLatency: 2, // control steps of actuator delay
		obsNoise: 0.03,
	},
};

// Keep the sampled airframe flyable: it must be able to lift itself with
// margin to spare for attitude control. Without this, a heavy mass paired with
// weak rotors produces episodes that are unwinnable no matter what the policy
// does, which just injects noise into the returns.
function clampFeasible(cfg, mass, thrustScale) {
	const maxLift = 2 * cfg.maxThrust * thrustScale;
	const needed = 1.45; // lift/weight ratio we insist on keeping
	const maxMass = maxLift / (cfg.g * needed);
	return Math.min(mass, maxMass);
}

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
		drScale: 0,
		// Integrated position error (see observe): gives the policy the one
		// piece of state it needs to reject a *constant* unmodelled force.
		ix: 0,
		iy: 0,
		gustX: 0,
		gustY: 0,
		gustSteps: 0,
		// External disturbance the *user* applies at run time (not training).
		extForceX: 0,
		extForceY: 0,
		actionQueue: [],
		steps: 0,
		done: false,
	};
}

export function reset(env, { randomize = false, drScale = 1 } = {}) {
	const { cfg, rng } = env;
	// A single knob for "how hard is the training distribution".
	env.drScale = randomize ? Math.max(0, drScale) : 0;

	// Start displaced from the goal with some initial motion, so the policy
	// has to actually fly rather than memorise a fixed trajectory.
	env.x = (rng() * 2 - 1) * 1.6;
	env.y = (rng() * 2 - 1) * 1.2;
	env.vx = (rng() * 2 - 1) * 0.6;
	env.vy = (rng() * 2 - 1) * 0.6;
	env.th = (rng() * 2 - 1) * 0.25;
	env.om = (rng() * 2 - 1) * 0.4;

	const s = env.drScale;
	if (s > 0) {
		const d = cfg.dr;
		env.thrustScale = 1 + (rng() * 2 - 1) * d.thrustDev * s;
		env.mass = clampFeasible(
			cfg,
			cfg.mass * (1 + (rng() * 2 - 1) * d.massDev * s),
			env.thrustScale
		);
		env.windX = (rng() * 2 - 1) * d.windMax * s;
		env.windY = (rng() * 2 - 1) * d.windMax * 0.5 * s;
		env.latency = Math.floor(rng() * (d.maxLatency * s + 1));
		env.obsNoise = d.obsNoise * s;
	} else {
		env.mass = cfg.mass;
		env.thrustScale = 1;
		env.windX = 0;
		env.windY = 0;
		env.latency = 0;
		env.obsNoise = 0;
	}

	env.ix = 0;
	env.iy = 0;
	env.gustX = 0;
	env.gustY = 0;
	env.gustSteps = 0;
	env.actionQueue = [];
	env.extForceX = 0;
	env.extForceY = 0;
	env.steps = 0;
	env.done = false;
	return observe(env);
}

// The last two components are the *integral* of position error. Without them
// the policy is structurally a PD controller: against a constant unmodelled
// force it can only settle at an offset proportional to that force, no matter
// how much domain randomization it saw. Integral state is what makes true
// rejection representable — the same reason a real attitude controller has an
// I term. It is clamped for anti-windup.
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
		-env.ix / 2,
		-env.iy / 2,
	];
}

const I_CLAMP = 3.0; // anti-windup bound on the integrated error

// Reward: stay near the goal, upright, calm, and don't slam the motors.
//
// The shaping terms are bounded Gaussians rather than linear penalties, which
// matters more than it looks. A linear -k*distance makes the per-step reward
// negative far from the goal, and since a crash merely ends the episode, the
// agent discovers that dying immediately beats living with a negative income —
// it learns to crash faster, not fly better. Keeping every term non-negative
// means survival always dominates, and the crash penalty is what it appears
// to be rather than a mercy.
//
// The upright term is deliberately wide. Rejecting a lateral force *requires*
// tilting — holding against 8 N needs ~39 degrees — so a sharp upright bonus
// punishes the agent for the exact behaviour domain randomization is trying to
// teach. Crash termination at maxTilt already prevents tumbling; this term only
// needs to discourage pointless thrashing.
export function reward(env, action) {
	const dist = Math.hypot(env.x, env.y);
	const speed = Math.hypot(env.vx, env.vy);
	const effort = action[0] * action[0] + action[1] * action[1];
	const atGoal = 2.0 * Math.exp(-0.8 * dist * dist);
	const upright = 0.6 * Math.exp(-1.2 * env.th * env.th);
	const calm = 0.4 * Math.exp(-0.5 * speed * speed);
	return atGoal + upright + calm - 0.02 * Math.abs(env.om) - 0.005 * effort;
}

export function step(env, actionRaw) {
	const { cfg, rng } = env;

	// Transient gusts. Constant per-episode wind only teaches a steady trim;
	// the disturbance a user applies with the cursor is a sudden shove, so the
	// training distribution has to contain sudden shoves too.
	if (env.drScale > 0) {
		const d = cfg.dr;
		if (env.gustSteps > 0) {
			env.gustSteps -= 1;
			if (env.gustSteps === 0) {
				env.gustX = 0;
				env.gustY = 0;
			}
		} else if (rng() < d.gustProb * env.drScale) {
			const ang = rng() * 2 * Math.PI;
			const mag = rng() * d.gustMax * env.drScale;
			env.gustX = Math.cos(ang) * mag;
			env.gustY = Math.sin(ang) * mag * 0.6;
			env.gustSteps =
				d.gustLen[0] +
				Math.floor(rng() * (d.gustLen[1] - d.gustLen[0]));
		}
	}

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

	const ax =
		(-T * Math.sin(env.th) + env.windX + env.gustX + env.extForceX) /
		env.mass;
	const ay =
		(T * Math.cos(env.th) + env.windY + env.gustY + env.extForceY) /
			env.mass -
		cfg.g;
	const alpha = torque / cfg.inertia;

	// Semi-implicit Euler: integrate velocity first, then position.
	const dt = cfg.dt;
	env.vx += ax * dt;
	env.vy += ay * dt;
	env.om += alpha * dt;
	env.x += env.vx * dt;
	env.y += env.vy * dt;
	env.th += env.om * dt;

	env.ix = Math.max(-I_CLAMP, Math.min(I_CLAMP, env.ix + env.x * dt));
	env.iy = Math.max(-I_CLAMP, Math.min(I_CLAMP, env.iy + env.y * dt));

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
