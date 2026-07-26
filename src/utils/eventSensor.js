// Pure DVS ("event camera") pixel model, kept separate from the React
// component so it can be unit-tested.
//
// Each pixel independently tracks the LOG of incoming brightness and fires an
// asynchronous event when that value departs from its own reference by more
// than a contrast threshold C:
//
//     L = log(luma + LOG_OFFSET)
//     ON  event when  L - L_ref >  C   (got brighter)
//     OFF event when  L - L_ref < -C   (got darker)
//
// Only then does that pixel's reference advance — by exactly one contrast
// step, the way real hardware resets. Unchanged pixels emit nothing at all,
// which is the whole point of the sensor.

// Keeps log() well-behaved for near-black pixels.
export const LOG_OFFSET = 12;

export function createSensorState(width, height) {
	const n = width * height;
	return {
		width,
		height,
		ref: new Float32Array(n).fill(NaN), // per-pixel reference log-intensity
		on: new Float32Array(n), // ON event surface (decays for visibility)
		off: new Float32Array(n), // OFF event surface
	};
}

export function logIntensity(r, g, b) {
	const luma = 0.299 * r + 0.587 * g + 0.114 * b;
	return { luma, L: Math.log(luma + LOG_OFFSET) };
}

/**
 * Advance the sensor by one frame and paint the event surfaces into `out`.
 *
 * @param {Uint8ClampedArray} src  RGBA source pixels
 * @param {object} state           from createSensorState()
 * @param {object} opts            { threshold, persistence, ghost }
 * @param {Uint8ClampedArray} out  RGBA destination (may be omitted)
 * @returns {number} how many events fired this frame
 */
export function processFrame(src, state, opts, out) {
	const { ref, on, off } = state;
	const C = opts.threshold;
	const decay = opts.persistence;
	const ghost = !!opts.ghost;
	let fired = 0;

	for (let i = 0, p = 0; i < ref.length; i++, p += 4) {
		const { luma, L } = logIntensity(src[p], src[p + 1], src[p + 2]);

		let prev = ref[i];
		if (Number.isNaN(prev)) {
			// First sight of this pixel: latch it, emit nothing.
			ref[i] = L;
			prev = L;
		}

		const diff = L - prev;
		if (diff > C) {
			on[i] = 1;
			ref[i] = prev + C;
			fired++;
		} else if (diff < -C) {
			off[i] = 1;
			ref[i] = prev - C;
			fired++;
		} else {
			on[i] *= decay;
			off[i] *= decay;
		}

		if (out) {
			const base = ghost ? luma * 0.16 : 0;
			out[p] = base + off[i] * 255; // red  = OFF
			out[p + 1] = base + on[i] * 255; // green = ON
			out[p + 2] = base;
			out[p + 3] = 255;
		}
	}

	return fired;
}
