import React, { useCallback, useEffect, useRef, useState } from "react";

import {
	createEnv,
	mulberry32,
	observe,
	reset,
	setDisturbance,
	step,
} from "../../utils/rl/env";
import { forward } from "../../utils/rl/nn";
import { DEFAULT_HP } from "../../utils/rl/trainer";
import Sparkline from "./sparkline";

import "./styles/rlLab.css";

const HISTORY = 160;
const VIEW = 3.2; // metres shown from the centre of the canvas

// Rebuild a runnable network from the weights the worker posts.
function policyFromSnapshot(snap) {
	if (!snap) return null;
	return {
		sizes: snap.sizes,
		nLayers: snap.sizes.length - 1,
		W: snap.W.map((w) => Float64Array.from(w)),
		b: snap.b.map((v) => Float64Array.from(v)),
	};
}

const push = (arr, v) => {
	const out = arr.length >= HISTORY ? arr.slice(1) : arr.slice();
	out.push(v);
	return out;
};

const RLLab = () => {
	const canvasRef = useRef(null);
	const workerRef = useRef(null);
	const policyRef = useRef(null);
	const rafRef = useRef(null);

	// Visualisation env lives on the main thread so it can animate smoothly
	// and react to the cursor without disturbing training.
	const vizRef = useRef(null);
	const mouseRef = useRef({ active: false, x: 0, y: 0 });
	const accRef = useRef(0);
	const lastTsRef = useRef(0);
	const trailRef = useRef([]);

	const [running, setRunning] = useState(false);
	const [stats, setStats] = useState(null);
	const [hist, setHist] = useState({
		ret: [], ent: [], kl: [], clip: [], ev: [], vloss: [],
	});

	// Live-tunable hyperparameters.
	const [lr, setLr] = useState(DEFAULT_HP.lr);
	const [clipEps, setClipEps] = useState(DEFAULT_HP.clipEps);
	const [entCoef, setEntCoef] = useState(DEFAULT_HP.entCoef);
	const [lam, setLam] = useState(DEFAULT_HP.lam);
	const [normalizeAdv, setNormalizeAdv] = useState(true);
	// Require a reset (they change the distribution the rollout is drawn from).
	const [randomize, setRandomize] = useState(false);
	const [drScale, setDrScale] = useState(1);
	const [gust, setGust] = useState(6);

	const gustRef = useRef(gust);
	useEffect(() => {
		gustRef.current = gust;
	}, [gust]);

	// ---- worker wiring ---------------------------------------------------
	const startWorker = useCallback(
		(hpOverride = {}) => {
			if (workerRef.current) workerRef.current.terminate();
			const w = new Worker(
				new URL("../../utils/rl/trainWorker.js", import.meta.url),
				{ type: "module" }
			);
			w.onmessage = (e) => {
				const m = e.data;
				if (m.type === "stats") {
					policyRef.current = policyFromSnapshot(m.policy);
					setStats(m.stats);
					if (m.stats.iteration > 0) {
						setHist((h) => ({
							ret: push(h.ret, m.stats.meanReturn),
							ent: push(h.ent, m.stats.entropy),
							kl: push(h.kl, m.stats.approxKL),
							clip: push(h.clip, m.stats.clipFrac),
							ev: push(h.ev, m.stats.explainedVar),
							vloss: push(h.vloss, m.stats.valueLoss),
						}));
					} else {
						setHist({ ret: [], ent: [], kl: [], clip: [], ev: [], vloss: [] });
					}
				} else if (m.type === "paused") {
					setRunning(false);
				}
			};
			workerRef.current = w;
			w.postMessage({
				type: "reset",
				hp: {
					...DEFAULT_HP,
					lr, clipEps, entCoef, lam, normalizeAdv, randomize, drScale,
					...hpOverride,
				},
				seed: 42,
			});
		},
		[lr, clipEps, entCoef, lam, normalizeAdv, randomize, drScale]
	);

	useEffect(() => {
		vizRef.current = createEnv({ rng: mulberry32(2026) });
		reset(vizRef.current, { randomize: false });
		startWorker();
		return () => {
			if (workerRef.current) workerRef.current.terminate();
			cancelAnimationFrame(rafRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Push live-tunable knobs without restarting training. randomize/drScale
	// belong here too: they only change what reset() samples for the *next*
	// episode, so the network, optimizer state and return statistics all stay
	// valid. That makes "converge nominally, then switch DR on and watch it
	// adapt" a usable curriculum rather than a restart.
	useEffect(() => {
		if (workerRef.current) {
			workerRef.current.postMessage({
				type: "setHP",
				hp: { lr, clipEps, entCoef, lam, normalizeAdv, randomize, drScale },
			});
		}
	}, [lr, clipEps, entCoef, lam, normalizeAdv, randomize, drScale]);

	const toggleRun = () => {
		const w = workerRef.current;
		if (!w) return;
		if (running) {
			w.postMessage({ type: "pause" });
			setRunning(false);
		} else {
			w.postMessage({ type: "start" });
			setRunning(true);
		}
	};

	const doReset = (over = {}) => {
		setRunning(false);
		setStats(null);
		setHist({ ret: [], ent: [], kl: [], clip: [], ev: [], vloss: [] });
		trailRef.current = [];
		reset(vizRef.current, { randomize: false });
		startWorker(over);
	};

	// ---- animation -------------------------------------------------------
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");

		const frame = (ts) => {
			rafRef.current = requestAnimationFrame(frame);
			const env = vizRef.current;
			if (!env) return;

			const dpr = window.devicePixelRatio || 1;
			const cw = canvas.clientWidth;
			const ch = canvas.clientHeight;
			if (canvas.width !== Math.round(cw * dpr)) {
				canvas.width = Math.round(cw * dpr);
				canvas.height = Math.round(ch * dpr);
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			// Step the sim in real time rather than once per frame, so the
			// physics rate is independent of the display rate.
			const dt = env.cfg.dt;
			const now = ts / 1000;
			if (!lastTsRef.current) lastTsRef.current = now;
			accRef.current = Math.min(accRef.current + (now - lastTsRef.current), 0.2);
			lastTsRef.current = now;

			while (accRef.current >= dt) {
				accRef.current -= dt;

				// Cursor gust: pushes the robot away from the pointer, falling
				// off with distance. This is *not* part of training — it is the
				// run-time disturbance the policy has to reject.
				const m = mouseRef.current;
				if (m.active) {
					const dx = env.x - m.x;
					const dy = env.y - m.y;
					const r2 = dx * dx + dy * dy + 0.25;
					const mag = gustRef.current / r2;
					const r = Math.sqrt(r2);
					setDisturbance(env, (dx / r) * mag, (dy / r) * mag);
				} else {
					setDisturbance(env, 0, 0);
				}

				const pol = policyRef.current;
				let action = [0, 0];
				if (pol) {
					// Use the env's own observation function rather than
					// rebuilding it here — duplicating it silently breaks the
					// moment the observation gains a component.
					const acts = forward(pol, observe(env));
					action = acts[pol.nLayers];
				}
				const res = step(env, action);
				trailRef.current.push([env.x, env.y]);
				if (trailRef.current.length > 90) trailRef.current.shift();
				if (res.done) {
					reset(env, { randomize: false });
					trailRef.current = [];
				}
			}

			// ---- draw ----
			const scale = Math.min(cw, ch) / (2 * VIEW);
			const sx = (x) => cw / 2 + x * scale;
			const sy = (y) => ch / 2 - y * scale;

			ctx.clearRect(0, 0, cw, ch);
			ctx.fillStyle = "#0b0f14";
			ctx.fillRect(0, 0, cw, ch);

			// grid
			ctx.strokeStyle = "rgba(255,255,255,0.06)";
			ctx.lineWidth = 1;
			for (let g = -3; g <= 3; g++) {
				ctx.beginPath();
				ctx.moveTo(sx(g), 0);
				ctx.lineTo(sx(g), ch);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, sy(g));
				ctx.lineTo(cw, sy(g));
				ctx.stroke();
			}

			// goal
			ctx.strokeStyle = "rgba(20,184,166,0.85)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(sx(0), sy(0), 10, 0, Math.PI * 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(sx(0) - 16, sy(0));
			ctx.lineTo(sx(0) + 16, sy(0));
			ctx.moveTo(sx(0), sy(0) - 16);
			ctx.lineTo(sx(0), sy(0) + 16);
			ctx.stroke();

			// trail
			const trail = trailRef.current;
			if (trail.length > 1) {
				ctx.beginPath();
				ctx.moveTo(sx(trail[0][0]), sy(trail[0][1]));
				for (let i = 1; i < trail.length; i++) {
					ctx.lineTo(sx(trail[i][0]), sy(trail[i][1]));
				}
				ctx.strokeStyle = "rgba(94,234,212,0.35)";
				ctx.lineWidth = 1.5;
				ctx.stroke();
			}

			// cursor gust
			const m = mouseRef.current;
			if (m.active) {
				const grad = ctx.createRadialGradient(
					sx(m.x), sy(m.y), 2, sx(m.x), sy(m.y), 70
				);
				grad.addColorStop(0, "rgba(239,68,68,0.35)");
				grad.addColorStop(1, "rgba(239,68,68,0)");
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.arc(sx(m.x), sy(m.y), 70, 0, Math.PI * 2);
				ctx.fill();
				ctx.strokeStyle = "rgba(239,68,68,0.8)";
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(sx(m.x), sy(m.y));
				ctx.lineTo(sx(env.x), sy(env.y));
				ctx.stroke();
			}

			// the robot
			const bx = sx(env.x);
			const by = sy(env.y);
			const arm = env.cfg.arm * scale * 2.6;
			ctx.save();
			ctx.translate(bx, by);
			ctx.rotate(-env.th);
			ctx.strokeStyle = "#e4e4e7";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(-arm, 0);
			ctx.lineTo(arm, 0);
			ctx.stroke();
			ctx.fillStyle = "#5eead4";
			ctx.beginPath();
			ctx.arc(-arm, 0, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(arm, 0, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(-5, -4, 10, 8);
			ctx.restore();
		};

		rafRef.current = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	// ---- pointer ---------------------------------------------------------
	const onPointerMove = (e) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const r = canvas.getBoundingClientRect();
		const scale = Math.min(r.width, r.height) / (2 * VIEW);
		mouseRef.current = {
			active: true,
			x: (e.clientX - r.left - r.width / 2) / scale,
			y: -(e.clientY - r.top - r.height / 2) / scale,
		};
	};
	const onPointerLeave = () => {
		mouseRef.current = { ...mouseRef.current, active: false };
	};

	const s = stats;
	const fmt = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "—");

	return (
		<div className="rl-wrap">
		<div className="rl">
			<div className="rl-main">
				<div className="rl-stage-wrap">
					<canvas
						ref={canvasRef}
						className="rl-canvas"
						onPointerMove={onPointerMove}
						onPointerLeave={onPointerLeave}
					/>
					{/* Be explicit that this is evaluation, not the rollout the
					    gradients come from — otherwise it reads as though the
					    cursor is perturbing training, which it never does. */}
					<div className="rl-stage-hint">
						<strong>Evaluation view</strong> — greedy policy, live
						snapshot of training. Your cursor adds a disturbance the
						agent never sees while learning.
					</div>
					<div className="rl-stage-badges">
						<span className="rl-badge">
							iter {s ? s.iteration : 0}
						</span>
						<span className="rl-badge">
							{s ? (s.totalSteps / 1000).toFixed(1) : "0.0"}k steps
						</span>
						{randomize && (
							<span className="rl-badge dr">domain randomized</span>
						)}
					</div>
				</div>

				<div className="rl-actions">
					<button
						className={"rl-btn primary" + (running ? " on" : "")}
						onClick={toggleRun}
					>
						{running ? "Pause training" : "Train"}
					</button>
					<button className="rl-btn" onClick={() => doReset()}>
						Reset
					</button>
					<label className="rl-check">
						<input
							type="checkbox"
							checked={randomize}
							onChange={(e) => setRandomize(e.target.checked)}
						/>
						Domain randomization
						<em>applies from the next episode</em>
					</label>

					{randomize && (
						<label className="rl-drscale">
							<span>
								Strength <em>{drScale.toFixed(1)}×</em>
							</span>
							<input
								type="range"
								min={0.5}
								max={1.5}
								step={0.1}
								value={drScale}
								onChange={(e) =>
									setDrScale(parseFloat(e.target.value))
								}
							/>
						</label>
					)}
				</div>
			</div>

			<div className="rl-side">
				<div className="rl-metrics">
					<div className="rl-metric">
						<span>Mean return</span>
						<strong>{fmt(s && s.meanReturn, 1)}</strong>
					</div>
					<div className="rl-metric">
						<span>Crash rate</span>
						<strong>
							{s ? (s.crashRate * 100).toFixed(0) + "%" : "—"}
						</strong>
					</div>
				</div>

				<Sparkline
					label="Episode return"
					data={hist.ret}
					color="#14b8a6"
					format={(v) => v.toFixed(0)}
				/>
				<Sparkline
					label="Policy entropy"
					data={hist.ent}
					color="#6366f1"
				/>
				<Sparkline
					label="Approx KL"
					data={hist.kl}
					color="#f59e0b"
					format={(v) => v.toFixed(4)}
				/>
				<Sparkline
					label="Clip fraction"
					data={hist.clip}
					color="#ef4444"
				/>
				<Sparkline
					label="Explained variance"
					data={hist.ev}
					color="#22c55e"
					zeroLine
				/>
			</div>
		</div>

			<div className="rl-controls">
				<div className="rl-controls-title">Hyperparameters</div>
				<div className="rl-controls-grid">
					<label className="rl-slider">
						<span>
							Learning rate <em>{lr.toExponential(1)}</em>
						</span>
						<input
							type="range" min={-5} max={-1.2} step={0.05}
							value={Math.log10(lr)}
							onChange={(e) => setLr(Math.pow(10, parseFloat(e.target.value)))}
						/>
						<small>Too high and the policy leaves the trust region — watch KL spike.</small>
					</label>

					<label className="rl-slider">
						<span>
							Clip ε <em>{clipEps.toFixed(2)}</em>
						</span>
						<input
							type="range" min={0.02} max={0.8} step={0.01}
							value={clipEps}
							onChange={(e) => setClipEps(parseFloat(e.target.value))}
						/>
						<small>The trust region itself. Large ε stops protecting the update.</small>
					</label>

					<label className="rl-slider">
						<span>
							Entropy coef <em>{entCoef.toFixed(3)}</em>
						</span>
						<input
							type="range" min={0} max={0.05} step={0.001}
							value={entCoef}
							onChange={(e) => setEntCoef(parseFloat(e.target.value))}
						/>
						<small>0 collapses exploration early; too high and it never commits.</small>
					</label>

					<label className="rl-slider">
						<span>
							GAE λ <em>{lam.toFixed(2)}</em>
						</span>
						<input
							type="range" min={0} max={1} step={0.01}
							value={lam}
							onChange={(e) => setLam(parseFloat(e.target.value))}
						/>
						<small>Bias/variance dial: 0 is one-step TD, 1 is Monte-Carlo.</small>
					</label>

					<label className="rl-slider">
						<span>
							Cursor gust <em>{gust.toFixed(0)} N</em>
						</span>
						<input
							type="range" min={0} max={20} step={1}
							value={gust}
							onChange={(e) => setGust(parseFloat(e.target.value))}
						/>
						<small>Strength of the disturbance your cursor applies.</small>
					</label>

					<label className="rl-check inline">
						<input
							type="checkbox"
							checked={normalizeAdv}
							onChange={(e) => setNormalizeAdv(e.target.checked)}
						/>
						Normalize advantages
						<em>keeps the surrogate scale-free</em>
					</label>
				</div>
			</div>
		</div>
	);
};

export default RLLab;
