import React, { useEffect, useRef } from "react";

// Small canvas line chart for a streaming metric. Deliberately minimal: no
// chart library, just enough axis context to read a training curve.
const Sparkline = ({
	data,
	color = "#14b8a6",
	height = 46,
	zeroLine = false,
	format = (v) => v.toFixed(2),
	label,
}) => {
	const ref = useRef(null);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		const w = canvas.clientWidth;
		const h = height;
		canvas.width = Math.max(1, Math.round(w * dpr));
		canvas.height = Math.round(h * dpr);
		const ctx = canvas.getContext("2d");
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);

		if (!data || data.length < 2) return;

		let min = Infinity;
		let max = -Infinity;
		for (const v of data) {
			if (!Number.isFinite(v)) continue;
			if (v < min) min = v;
			if (v > max) max = v;
		}
		if (!Number.isFinite(min) || !Number.isFinite(max)) return;
		if (zeroLine) {
			min = Math.min(min, 0);
			max = Math.max(max, 0);
		}
		if (max - min < 1e-9) {
			max += 1;
			min -= 1;
		}
		const pad = (max - min) * 0.12;
		min -= pad;
		max += pad;

		const xOf = (i) => (i / (data.length - 1)) * w;
		const yOf = (v) => h - ((v - min) / (max - min)) * h;

		if (zeroLine && min < 0 && max > 0) {
			ctx.strokeStyle = "rgba(0,0,0,0.14)";
			ctx.setLineDash([3, 3]);
			ctx.beginPath();
			ctx.moveTo(0, yOf(0));
			ctx.lineTo(w, yOf(0));
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Soft fill under the curve for readability at this size.
		ctx.beginPath();
		ctx.moveTo(xOf(0), yOf(data[0]));
		for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
		ctx.lineTo(xOf(data.length - 1), h);
		ctx.lineTo(xOf(0), h);
		ctx.closePath();
		ctx.fillStyle = color + "1f";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(xOf(0), yOf(data[0]));
		for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
		ctx.strokeStyle = color;
		ctx.lineWidth = 1.6;
		ctx.lineJoin = "round";
		ctx.stroke();
	}, [data, color, height, zeroLine]);

	const latest = data && data.length ? data[data.length - 1] : null;

	return (
		<div className="spark">
			<div className="spark-head">
				<span className="spark-label">{label}</span>
				<span className="spark-value" style={{ color }}>
					{latest === null || !Number.isFinite(latest)
						? "—"
						: format(latest)}
				</span>
			</div>
			<canvas ref={ref} style={{ width: "100%", height }} />
		</div>
	);
};

export default Sparkline;
