import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import EventCamera from "./eventCamera";

// jsdom has no real canvas, video decoding, or IntersectionObserver — stub
// just enough that mounting the component doesn't throw and its "am I on
// screen" logic has something to call.
beforeEach(() => {
	HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
		drawImage: vi.fn(),
		getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
		putImageData: vi.fn(),
		createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
	}));
	HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
	HTMLMediaElement.prototype.pause = vi.fn();

	global.IntersectionObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));

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
});
