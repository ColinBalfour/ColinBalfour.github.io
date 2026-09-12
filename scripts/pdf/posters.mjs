import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const run = promisify(execFile);

export function isVideo(src) {
	return /\.(mp4|webm)(\?|#|$)/i.test(src || "");
}

// The seek point is baked into the cache filename so that changing
// `pdfPosterAt` (or the 40% default resolving differently as a video is
// re-encoded) can never return a stale frame extracted at a different point.
export function posterPath(src, cacheDir, seekSeconds) {
	const base = path.basename(src).replace(/\.[^.]+$/, "");
	const seekMs = Math.round(seekSeconds * 1000);
	return path.join(cacheDir, `${base}@${seekMs}.jpg`);
}

// 40% in avoids fade-ins at the start and end cards at the end. An explicit
// override past the end of the clip would yield a blank frame, so fall back.
export function seekSeconds(durationSeconds, at) {
	const fallback = durationSeconds * 0.4;
	if (!at) return fallback;

	const parts = String(at).split(":").map(Number);
	if (parts.some((n) => Number.isNaN(n))) return fallback;

	let seconds;
	if (parts.length === 3) {
		seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
	} else if (parts.length === 2) {
		seconds = parts[0] * 60 + parts[1];
	} else if (parts.length === 1) {
		seconds = parts[0];
	} else {
		return fallback;
	}

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

async function isNonEmptyFile(file) {
	const stat = await fs.stat(file).catch(() => null);
	return Boolean(stat && stat.size > 0);
}

// Returns the absolute path of a cached still, or null if extraction failed.
// Failure is non-fatal: the caller renders that card text-only and warns.
export async function ensurePoster(src, { publicDir, cacheDir, at }) {
	const source = path.join(publicDir, src.replace(/^\//, ""));

	try {
		const srcStat = await fs.stat(source);
		const seek = seekSeconds(await probeDuration(source), at);
		const out = posterPath(src, cacheDir, seek);

		const outStat = await fs.stat(out).catch(() => null);
		// Cached and newer than the source: reuse it.
		if (outStat && outStat.mtimeMs >= srcStat.mtimeMs && outStat.size > 0) {
			return out;
		}

		await fs.mkdir(cacheDir, { recursive: true });

		// Extract to a temp sibling first so a failed/partial ffmpeg run can
		// never leave behind a file that a later run mistakes for a valid
		// cached poster.
		const tmp = `${out}.tmp-${process.pid}.jpg`;
		try {
			await run("ffmpeg", [
				"-y",
				"-ss", String(seek),
				"-i", source,
				"-frames:v", "1",
				"-q:v", "3",
				tmp,
			]);

			if (!(await isNonEmptyFile(tmp))) {
				await fs.rm(tmp, { force: true });
				return null;
			}

			await fs.rename(tmp, out);
		} catch (error) {
			await fs.rm(tmp, { force: true });
			throw error;
		}

		return (await isNonEmptyFile(out)) ? out : null;
	} catch {
		return null;
	}
}
