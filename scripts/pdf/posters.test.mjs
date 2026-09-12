import { describe, it, expect } from "vitest";
import { isVideo, posterPath, seekSeconds } from "./posters.mjs";

describe("isVideo", () => {
	it("detects video extensions and ignores stills", () => {
		expect(isVideo("/selfplay_fpv_pursuit.mp4")).toBe(true);
		expect(isVideo("/clip.webm")).toBe(true);
		expect(isVideo("/activenav.jpg")).toBe(false);
		expect(isVideo("/einstein-vision.png")).toBe(false);
		expect(isVideo("")).toBe(false);
		expect(isVideo(undefined)).toBe(false);
	});
});

describe("posterPath", () => {
	it("maps a video into the cache dir as a .jpg", () => {
		expect(posterPath("/Events_Video.mp4", "/tmp/cache")).toBe(
			"/tmp/cache/Events_Video.jpg"
		);
	});
});

describe("seekSeconds", () => {
	it("defaults to 40% into the clip", () => {
		expect(seekSeconds(10)).toBeCloseTo(4);
	});

	it("parses an explicit m:ss override", () => {
		expect(seekSeconds(60, "0:02")).toBe(2);
		expect(seekSeconds(600, "1:30")).toBe(90);
	});

	it("parses a bare-seconds override", () => {
		expect(seekSeconds(60, "7")).toBe(7);
	});

	it("clamps an override past the end back to the 40% default", () => {
		expect(seekSeconds(10, "0:30")).toBeCloseTo(4);
	});
});
