// Training runs here, off the main thread.
//
// One PPO iteration takes ~200ms, which would visibly freeze the page if it
// ran inline. Instead the worker owns the trainer and posts a snapshot of the
// policy after each iteration; the page animates the robot at 60fps against
// whatever snapshot it last received.

import { createTrainer, trainIteration } from "./trainer";

let trainer = null;
let running = false;
let stopRequested = false;

function snapshot() {
	const { pi, logStd } = trainer.agent;
	return {
		sizes: pi.sizes,
		W: pi.W.map((w) => Array.from(w)),
		b: pi.b.map((v) => Array.from(v)),
		logStd: Array.from(logStd),
	};
}

function post(stats) {
	self.postMessage({ type: "stats", stats, policy: snapshot() });
}

async function loop() {
	running = true;
	while (!stopRequested) {
		const stats = trainIteration(trainer);
		post(stats);
		// Yield so incoming control messages (pause, hyperparameters) are seen
		// between iterations rather than after the whole run.
		await new Promise((r) => setTimeout(r, 0));
	}
	running = false;
	self.postMessage({ type: "paused" });
}

self.onmessage = (e) => {
	const msg = e.data;
	switch (msg.type) {
		case "reset":
			stopRequested = true;
			trainer = createTrainer(msg.hp, msg.seed ?? 42);
			self.postMessage({
				type: "stats",
				stats: {
					iteration: 0,
					totalSteps: 0,
					meanReturn: 0,
					entropy: 0,
					approxKL: 0,
					clipFrac: 0,
					explainedVar: 0,
					policyLoss: 0,
					valueLoss: 0,
					crashRate: 0,
					episodes: 0,
				},
				policy: snapshot(),
			});
			break;

		case "start":
			if (!trainer) trainer = createTrainer(msg.hp, msg.seed ?? 42);
			if (!running) {
				stopRequested = false;
				loop();
			}
			break;

		case "pause":
			stopRequested = true;
			break;

		case "setHP":
			// Live-tunable knobs only; anything that changes tensor shapes or
			// the rollout layout needs a reset, which the UI enforces.
			// `randomize` and `drScale` are safe here: they are read by
			// reset() at the next episode boundary and touch nothing the
			// optimizer or the return statistics depend on.
			if (trainer) Object.assign(trainer.hp, msg.hp);
			break;

		default:
			break;
	}
};
