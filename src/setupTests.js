// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom implements neither real <canvas> 2D contexts, real <video>/<audio>
// playback, nor IntersectionObserver. The event camera (embedded on the
// homepage) and the RL lab sparkline draw to a canvas and play a <video> on
// mount, which otherwise spams every test that renders the homepage with
// jsdom's "not implemented" console noise. Stub them globally so any
// component can mount cleanly; tests that care about specific calls (e.g.
// asserting getUserMedia was never invoked) still override per-test.
if (typeof HTMLCanvasElement !== 'undefined') {
	HTMLCanvasElement.prototype.getContext = function () {
		return new Proxy(
			{},
			{
				get(target, prop) {
					if (prop === 'getImageData' || prop === 'createImageData') {
						return () => ({ data: new Uint8ClampedArray(4) });
					}
					return () => {};
				},
			}
		);
	};
}

if (typeof HTMLMediaElement !== 'undefined') {
	HTMLMediaElement.prototype.play = function () {
		return Promise.resolve();
	};
	HTMLMediaElement.prototype.pause = function () {};
}

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
	class StubIntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	window.IntersectionObserver = StubIntersectionObserver;
	global.IntersectionObserver = StubIntersectionObserver;
}
