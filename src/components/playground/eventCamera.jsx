import React, { useCallback, useEffect, useRef, useState } from "react";

import { createSensorState, processFrame } from "../../utils/eventSensor";
import "./styles/eventCamera.css";

// A browser simulation of a DVS (dynamic vision sensor) "event camera".
// The per-pixel sensor model itself lives in utils/eventSensor.js; this
// component just pumps webcam (or sample video) frames through it and paints
// the resulting events — ON green, OFF red — onto a canvas.

const PROC_WIDTH = 480; // processing resolution (height follows source aspect)

// Fixed-camera traffic footage: the road, sky and skyline stay perfectly
// still (and so stay black) while every car outlines itself in events —
// the clearest illustration of what the sensor does.
const SAMPLE_VIDEO = "/sample_traffic.mp4";

// Sensible starting points per source. The sample is a 10x timelapse, so a
// lot moves between frames and it needs a higher contrast threshold than a
// real-time webcam to stay legible.
const DEFAULTS = {
	webcam: { threshold: 0.18, persistence: 0.72 },
	video: { threshold: 0.34, persistence: 0.55 },
};

const EventCamera = () => {
	const canvasRef = useRef(null);
	const videoRef = useRef(null);
	const rafRef = useRef(null);
	const streamRef = useRef(null);

	// Per-pixel sensor state, allocated once the source size is known.
	const stateRef = useRef({ w: 0, h: 0, sensor: null, imageData: null });

	// Live control values read inside the animation loop (refs avoid restarting it).
	const [threshold, setThreshold] = useState(DEFAULTS.webcam.threshold);
	const [persistence, setPersistence] = useState(DEFAULTS.webcam.persistence);
	const [showGhost, setShowGhost] = useState(false);
	const [paused, setPaused] = useState(false);
	const ctrl = useRef({ threshold, persistence, showGhost, paused });
	useEffect(() => {
		ctrl.current = { threshold, persistence, showGhost, paused };
	}, [threshold, persistence, showGhost, paused]);

	const [source, setSource] = useState("idle"); // idle | webcam | video
	const [error, setError] = useState("");
	const [eventRate, setEventRate] = useState(0);

	// ---- the sensor loop -------------------------------------------------
	const startLoop = useCallback(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return;

		const work = document.createElement("canvas");
		const workCtx = work.getContext("2d", { willReadFrequently: true });
		const outCtx = canvas.getContext("2d");

		let lastRateStamp = performance.now();
		let eventsSinceStamp = 0;
		let frames = 0;

		const render = () => {
			rafRef.current = requestAnimationFrame(render);

			const vw = video.videoWidth;
			const vh = video.videoHeight;
			if (!vw || !vh || video.readyState < 2) return;
			if (ctrl.current.paused) return;

			const s = stateRef.current;
			const w = PROC_WIDTH;
			const h = Math.max(1, Math.round((vh / vw) * PROC_WIDTH));

			// (Re)allocate per-pixel state when the source size changes.
			if (s.w !== w || s.h !== h) {
				work.width = w;
				work.height = h;
				canvas.width = w;
				canvas.height = h;
				s.w = w;
				s.h = h;
				s.sensor = createSensorState(w, h);
				s.imageData = outCtx.createImageData(w, h);
			}

			workCtx.drawImage(video, 0, 0, w, h);
			const src = workCtx.getImageData(0, 0, w, h).data;

			const fired = processFrame(
				src,
				s.sensor,
				{
					threshold: ctrl.current.threshold,
					persistence: ctrl.current.persistence,
					ghost: ctrl.current.showGhost,
				},
				s.imageData.data
			);

			outCtx.putImageData(s.imageData, 0, 0);

			// Rolling events/sec readout.
			eventsSinceStamp += fired;
			frames++;
			const now = performance.now();
			if (now - lastRateStamp > 400) {
				const perSec = (eventsSinceStamp / (now - lastRateStamp)) * 1000;
				setEventRate(Math.round(perSec));
				eventsSinceStamp = 0;
				frames = 0;
				lastRateStamp = now;
			}
		};

		cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(render);
	}, []);

	const stopEverything = useCallback(() => {
		cancelAnimationFrame(rafRef.current);
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
		}
	}, []);

	const startWebcam = useCallback(async () => {
		setError("");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user", width: { ideal: 1280 } },
				audio: false,
			});
			streamRef.current = stream;
			const video = videoRef.current;
			video.srcObject = stream;
			video.removeAttribute("src");
			video.muted = true;
			stateRef.current.w = 0; // force re-alloc for the new source
			setThreshold(DEFAULTS.webcam.threshold);
			setPersistence(DEFAULTS.webcam.persistence);
			setSource("webcam");
			setPaused(false);
			startLoop();
			// Don't await: a hung play() must never leave the UI stuck. The
			// render loop already waits for readyState on its own.
			video.play().catch(() => {});
		} catch (e) {
			setError(
				"Couldn't access the camera — it may be blocked or in use. " +
					"You can still run the sensor on the sample footage instead."
			);
		}
	}, [startLoop]);

	const startSampleVideo = useCallback(() => {
		setError("");
		stopEverything();
		const video = videoRef.current;
		video.srcObject = null;
		video.src = SAMPLE_VIDEO;
		video.loop = true;
		video.muted = true;
		stateRef.current.w = 0;
		setThreshold(DEFAULTS.video.threshold);
		setPersistence(DEFAULTS.video.persistence);
		setSource("video");
		setPaused(false);
		startLoop();
		// Fire-and-forget for the same reason as the webcam path above.
		video.play().catch(() => {});
	}, [startLoop, stopEverything]);

	// ?src=video deep-links straight into the demo running on the sample
	// footage (no camera prompt) — handy for sharing.
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("src") === "video") startSampleVideo();
	}, [startSampleVideo]);

	useEffect(() => stopEverything, [stopEverything]);

	const active = source !== "idle";

	return (
		<div className="evcam">
			<div className="evcam-stage">
				{/* Mirror the webcam so it reads as a selfie view; sample
				    footage is left as-shot. */}
				<canvas
					ref={canvasRef}
					className={
						"evcam-canvas" +
						(source === "webcam" ? " mirrored" : "")
					}
				/>
				{/* Source frames are never shown directly — only the events. */}
				<video
					ref={videoRef}
					className="evcam-hidden-video"
					playsInline
					muted
				/>

				{!active && (
					<div className="evcam-overlay">
						<div className="evcam-overlay-title">
							See the world like an event camera
						</div>
						<div className="evcam-overlay-text">
							Your camera feed never leaves this page — every pixel
							is processed locally in your browser.
						</div>
						<div className="evcam-overlay-actions">
							<button
								className="evcam-btn primary"
								onClick={startWebcam}
							>
								Use my camera
							</button>
							<button
								className="evcam-btn"
								onClick={startSampleVideo}
							>
								Use sample footage
							</button>
						</div>
					</div>
				)}

				{active && (
					<div className="evcam-readout">
						<span className="evcam-dot" />
						{eventRate.toLocaleString()} events/sec
					</div>
				)}
			</div>

			{error && <div className="evcam-error">{error}</div>}

			<div className="evcam-controls">
				<label className="evcam-control">
					<span className="evcam-control-label">
						Contrast threshold
						<em>{threshold.toFixed(2)}</em>
					</span>
					<input
						type="range"
						min="0.04"
						max="0.6"
						step="0.01"
						value={threshold}
						onChange={(e) =>
							setThreshold(parseFloat(e.target.value))
						}
					/>
					<span className="evcam-hint">
						How much a pixel must change before it fires. Lower =
						more sensitive, noisier.
					</span>
				</label>

				<label className="evcam-control">
					<span className="evcam-control-label">
						Event persistence
						<em>{persistence.toFixed(2)}</em>
					</span>
					<input
						type="range"
						min="0"
						max="0.95"
						step="0.01"
						value={persistence}
						onChange={(e) =>
							setPersistence(parseFloat(e.target.value))
						}
					/>
					<span className="evcam-hint">
						How long an event lingers on screen. Real sensors have
						none — this just makes it visible.
					</span>
				</label>

				<div className="evcam-toggles">
					<button
						className={"evcam-chip" + (showGhost ? " on" : "")}
						onClick={() => setShowGhost((v) => !v)}
					>
						Ghost frame {showGhost ? "on" : "off"}
					</button>
					<button
						className="evcam-chip"
						onClick={() => setPaused((v) => !v)}
						disabled={!active}
					>
						{paused ? "Resume" : "Freeze"}
					</button>
					{active && (
						<button
							className="evcam-chip"
							onClick={
								source === "webcam"
									? startSampleVideo
									: startWebcam
							}
						>
							{source === "webcam"
								? "Switch to sample footage"
								: "Switch to my camera"}
						</button>
					)}
				</div>
			</div>

			<div className="evcam-legend">
				<span>
					<i className="evcam-swatch on" /> ON — brightness increased
				</span>
				<span>
					<i className="evcam-swatch off" /> OFF — brightness decreased
				</span>
			</div>

			{source === "video" && (
				<div className="evcam-credit">
					Sample footage:{" "}
					<a
						href="https://commons.wikimedia.org/wiki/File:Congested_traffic_on_the_Dan_Ryan_Expy_(10x_timelapse)_-_April_2026.webm"
						target="_blank"
						rel="noopener noreferrer"
					>
						“Congested traffic on the Dan Ryan Expy”
					</a>{" "}
					by AlphaBeta135, licensed{" "}
					<a
						href="https://creativecommons.org/licenses/by/4.0/"
						target="_blank"
						rel="noopener noreferrer"
					>
						CC BY 4.0
					</a>{" "}
					via Wikimedia Commons.
				</div>
			)}
		</div>
	);
};

export default EventCamera;
