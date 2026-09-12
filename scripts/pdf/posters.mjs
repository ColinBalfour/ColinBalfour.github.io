import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const run = promisify(execFile);

export function isVideo(src) {
	return /\.(mp4|webm)(\?|#|$)/i.test(src || "");
}

export function posterPath(src, cacheDir) {
	const base = path.basename(src).replace(/\.[^.]+$/, "");
	return path.join(cacheDir, `${base}.jpg`);
}

// 40% in avoids fade-ins at the start and end cards at the end. An explicit
// override past the end of the clip would yield a blank frame, so fall back.
export function seekSeconds(durationSeconds, at) {
	const fallback = durationSeconds * 0.4;
	if (!at) return fallback;

	const parts = String(at).split(":").map(Number);
	if (parts.some((n) => Number.isNaN(n))) return fallback;

	const seconds =
		parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
	return seconds >= 0 && seconds < durationSeconds ? seconds : fallback;
}

async function probeDuration(file) {
	const { stdout } = await run("ffprobe", [
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		file,
	]);
	return Number.parseFloat(stdout.trim());
}

// Returns the absolute path of a cached still, or null if extraction failed.
// Failure is non-fatal: the caller renders that card text-only and warns.
export async function ensurePoster(src, { publicDir, cacheDir, at }) {
	const source = path.join(publicDir, src.replace(/^\//, ""));
	const out = posterPath(src, cacheDir);

	try {
		const [srcStat, outStat] = await Promise.all([
			fs.stat(source),
			fs.stat(out).catch(() => null),
		]);
		// Cached and newer than the source: reuse it.
		if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) return out;

		await fs.mkdir(cacheDir, { recursive: true });
		const seek = seekSeconds(await probeDuration(source), at);

		await run("ffmpeg", [
			"-y",
			"-ss", String(seek),
			"-i", source,
			"-frames:v", "1",
			"-q:v", "3",
			out,
		]);
		return out;
	} catch {
		return null;
	}
}
