import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isVideo, posterPath, seekSeconds, ensurePoster } from "./posters.mjs";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../.."
);
const PUBLIC_DIR = path.join(ROOT, "public");
const SAMPLE_VIDEO = "/selfplay_fpv_pursuit.mp4";

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
	it("maps a video into the cache dir as a .jpg, keyed by the seek point", () => {
		expect(posterPath("/Events_Video.mp4", "/tmp/cache", 4)).toBe(
			"/tmp/cache/Events_Video@4000.jpg"
		);
	});

	it("gives different seeks different cache files", () => {
		const a = posterPath("/Events_Video.mp4", "/tmp/cache", 4);
		const b = posterPath("/Events_Video.mp4", "/tmp/cache", 12.5);
		expect(a).not.toBe(b);
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

	it("parses an h:mm:ss override", () => {
		expect(seekSeconds(4000, "1:02:03")).toBe(3723);
	});

	it("falls back to the 40% default for an override with too many parts", () => {
		expect(seekSeconds(10, "1:02:03:04")).toBeCloseTo(4);
	});

	it("clamps an override past the end back to the 40% default", () => {
		expect(seekSeconds(10, "0:30")).toBeCloseTo(4);
	});
});

describe("ensurePoster", () => {
	let cacheDir;

	beforeAll(async () => {
		cacheDir = await fs.mkdtemp(path.join(os.tmpdir(), "poster-cache-"));
	});

	afterAll(async () => {
		if (cacheDir) await fs.rm(cacheDir, { recursive: true, force: true });
	});

	it(
		"produces different cached files for different `at` values",
		async () => {
			const first = await ensurePoster(SAMPLE_VIDEO, {
				publicDir: PUBLIC_DIR,
				cacheDir,
				at: "0:01",
			});
			const second = await ensurePoster(SAMPLE_VIDEO, {
				publicDir: PUBLIC_DIR,
				cacheDir,
				at: "0:02",
			});

			expect(first).toBeTruthy();
			expect(second).toBeTruthy();
			expect(second).not.toBe(first);

			const firstStat = await fs.stat(first);
			const secondStat = await fs.stat(second);
			expect(firstStat.size).toBeGreaterThan(0);
			expect(secondStat.size).toBeGreaterThan(0);
		},
		30000
	);

	it(
		"reuses the cached file on a second call with the same inputs",
		async () => {
			const first = await ensurePoster(SAMPLE_VIDEO, {
				publicDir: PUBLIC_DIR,
				cacheDir,
				at: "0:01",
			});
			const firstStat = await fs.stat(first);

			// Give the filesystem a moment so a spurious re-extraction would
			// show up as a changed mtime.
			await new Promise((r) => setTimeout(r, 20));

			const second = await ensurePoster(SAMPLE_VIDEO, {
				publicDir: PUBLIC_DIR,
				cacheDir,
				at: "0:01",
			});
			const secondStat = await fs.stat(second);

			expect(second).toBe(first);
			expect(secondStat.mtimeMs).toBe(firstStat.mtimeMs);
		},
		30000
	);

	it(
		"returns null and leaves no stray files for a failing extraction",
		async () => {
			const before = await fs.readdir(cacheDir);

			const result = await ensurePoster("/does-not-exist.mp4", {
				publicDir: PUBLIC_DIR,
				cacheDir,
				at: "0:01",
			});

			expect(result).toBeNull();

			const after = await fs.readdir(cacheDir);
			expect(after).toEqual(before);
		},
		30000
	);
});
