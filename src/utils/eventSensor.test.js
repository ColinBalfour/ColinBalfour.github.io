import { describe, expect, test } from "vitest";

import { createSensorState, processFrame } from "./eventSensor";

const W = 4;
const H = 4;
const N = W * H;

// Build an RGBA buffer of uniform gray value v.
function frame(v) {
	const buf = new Uint8ClampedArray(N * 4);
	for (let p = 0; p < buf.length; p += 4) {
		buf[p] = v;
		buf[p + 1] = v;
		buf[p + 2] = v;
		buf[p + 3] = 255;
	}
	return buf;
}

const OPTS = { threshold: 0.18, persistence: 0.7 };

describe("event sensor pixel model", () => {
	test("emits nothing on the very first frame (references just latch)", () => {
		const state = createSensorState(W, H);
		expect(processFrame(frame(120), state, OPTS)).toBe(0);
	});

	test("a static scene produces no events", () => {
		const state = createSensorState(W, H);
		processFrame(frame(120), state, OPTS);
		expect(processFrame(frame(120), state, OPTS)).toBe(0);
		expect(processFrame(frame(120), state, OPTS)).toBe(0);
	});

	test("a brightness increase fires ON events (green)", () => {
		const state = createSensorState(W, H);
		const out = new Uint8ClampedArray(N * 4);
		processFrame(frame(60), state, OPTS, out);

		const fired = processFrame(frame(240), state, OPTS, out);
		expect(fired).toBe(N);
		expect(out[1]).toBe(255); // green channel lit
		expect(out[0]).toBe(0); // red stays dark
	});

	test("a brightness decrease fires OFF events (red)", () => {
		const state = createSensorState(W, H);
		const out = new Uint8ClampedArray(N * 4);
		processFrame(frame(240), state, OPTS, out);

		const fired = processFrame(frame(60), state, OPTS, out);
		expect(fired).toBe(N);
		expect(out[0]).toBe(255); // red channel lit
		expect(out[1]).toBe(0); // green stays dark
	});

	test("a lower threshold is more sensitive to the same change", () => {
		const build = (threshold) => {
			const state = createSensorState(W, H);
			processFrame(frame(120), state, { ...OPTS, threshold });
			return processFrame(frame(132), state, { ...OPTS, threshold });
		};
		expect(build(0.04)).toBe(N); // small change clears a low bar
		expect(build(0.6)).toBe(0); // ...but not a high one
	});

	test("events fade according to persistence once motion stops", () => {
		const state = createSensorState(W, H);
		const out = new Uint8ClampedArray(N * 4);
		// A change just over one contrast step, so each pixel fires once and
		// then settles (a bigger jump would keep firing — see the test below).
		processFrame(frame(120), state, OPTS, out);
		expect(processFrame(frame(158), state, OPTS, out)).toBe(N);

		const lit = out[1];
		processFrame(frame(158), state, OPTS, out); // hold still: decay
		expect(out[1]).toBeLessThan(lit);
		expect(out[1]).toBeGreaterThan(0); // but still visible

		for (let i = 0; i < 40; i++) processFrame(frame(158), state, OPTS, out);
		expect(out[1]).toBe(0); // eventually gone
	});

	test("the reference advances by one contrast step, not the full jump", () => {
		// A large jump leaves the pixel still above threshold, so it keeps
		// firing on subsequent frames until the reference catches up.
		const state = createSensorState(W, H);
		processFrame(frame(10), state, OPTS);
		expect(processFrame(frame(255), state, OPTS)).toBe(N);
		expect(processFrame(frame(255), state, OPTS)).toBe(N);
	});

	test("ghost mode adds a dim source underlay", () => {
		const state = createSensorState(W, H);
		const plain = new Uint8ClampedArray(N * 4);
		const ghosted = new Uint8ClampedArray(N * 4);

		const a = createSensorState(W, H);
		processFrame(frame(200), a, { ...OPTS, ghost: false }, plain);
		processFrame(frame(200), state, { ...OPTS, ghost: true }, ghosted);

		expect(plain[2]).toBe(0); // blue channel dark without ghost
		expect(ghosted[2]).toBeGreaterThan(0); // ghost lifts it
	});
});
