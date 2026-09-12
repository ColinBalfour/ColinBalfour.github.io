import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import EventCamera from "./eventCamera";

const SAMPLE_VIDEO = "/sample_traffic.mp4";

// Captured by the mocked IntersectionObserver constructor below, so tests
// can simulate the section scrolling into/out of view.
let observerCallback = null;

// jsdom has no real canvas, video decoding, or IntersectionObserver — stub
// just enough that mounting the component doesn't throw and its "am I on
// screen" logic has something to call.
beforeEach(() => {
	observerCallback = null;

	HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
		drawImage: vi.fn(),
		getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
		putImageData: vi.fn(),
		createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
	}));
	HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
	HTMLMediaElement.prototype.pause = vi.fn();

	global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
		observerCallback = callback;
		return {
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn(),
		};
	});

	global.navigator.mediaDevices = {
		getUserMedia: vi.fn(() => Promise.resolve({ getTracks: () => [] })),
	};
});

describe("EventCamera on the homepage", () => {
	test("mounts in sample mode without ever requesting the webcam", () => {
		render(<EventCamera />);

		expect(
			screen.getByRole("button", { name: /use my own camera/i })
		).toBeInTheDocument();
		expect(screen.getByText(/sample footage/i)).toBeInTheDocument();
		expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
	});

	test("starts the sample video only once the section scrolls into view", () => {
		render(<EventCamera />);

		// Nothing plays before the observer ever reports the section as visible.
		expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
		expect(observerCallback).toBeTypeOf("function");

		act(() => {
			observerCallback([{ isIntersecting: true }]);
		});

		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
		const video = document.querySelector(".evcam-hidden-video");
		expect(video.src).toContain(SAMPLE_VIDEO);
		expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
	});

	test("pauses playback again once the section scrolls back out of view", () => {
		render(<EventCamera />);

		act(() => {
			observerCallback([{ isIntersecting: true }]);
		});
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

		act(() => {
			observerCallback([{ isIntersecting: false }]);
		});

		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
	});
});
