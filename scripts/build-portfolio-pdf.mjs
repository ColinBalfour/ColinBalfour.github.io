#!/usr/bin/env node
// Builds public/ColinBalfourPortfolio.pdf from src/data/user.js.
//
// Deliberately shells out to the installed google-chrome rather than pulling
// in Puppeteer, which would download a second ~150MB Chromium to do a job
// Chrome already does.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { fileURLToPath } from "node:url";

import INFO from "../src/data/user.js";
import { selectProjects } from "./pdf/select.mjs";
import { isVideo, ensurePoster } from "./pdf/posters.mjs";
import { renderDocument } from "./pdf/render.mjs";

const run = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const CACHE_DIR = path.join(ROOT, ".pdf-cache");
const DEFAULT_OUT = path.join(PUBLIC_DIR, "ColinBalfourPortfolio.pdf");

// Parses `--out <path>` from argv, resolving it against the current working
// directory. Deliberately hand-rolled instead of pulling in an args library
// for a single optional flag.
function parseArgs(argv) {
	let out = null;
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === "--out") {
			const value = argv[i + 1];
			if (value === undefined) {
				throw new Error("--out requires a path argument.");
			}
			out = path.resolve(value);
			i++;
		}
	}
	return { out };
}

async function requireBinary(name) {
	try {
		await run("which", [name]);
	} catch {
		throw new Error(
			`Required binary "${name}" is not on PATH. ` +
				`Install it (ffmpeg: apt install ffmpeg / conda install ffmpeg; ` +
				`google-chrome: https://google.com/chrome) and re-run.`
		);
	}
}

// Resolves each project's photo to an absolute image path, extracting a still
// from video thumbnails. Returns a Map so rendering stays synchronous.
async function resolveImages(projects) {
	const images = new Map();

	for (const project of projects) {
		if (!project.photo) {
			console.warn(`  ! ${project.title}: no photo, rendering text-only`);
			images.set(project, null);
			continue;
		}

		if (isVideo(project.photo)) {
			const poster = await ensurePoster(project.photo, {
				publicDir: PUBLIC_DIR,
				cacheDir: CACHE_DIR,
				at: project.pdfPosterAt,
			});
			if (!poster) {
				console.warn(
					`  ! ${project.title}: could not extract a frame from ` +
						`${project.photo}, rendering text-only`
				);
			}
			images.set(project, poster);
			continue;
		}

		const file = path.join(PUBLIC_DIR, project.photo.replace(/^\//, ""));
		const exists = await fs
			.stat(file)
			.then(() => true)
			.catch(() => false);
		if (!exists) {
			console.warn(
				`  ! ${project.title}: ${project.photo} not found, rendering text-only`
			);
		}
		images.set(project, exists ? file : null);
	}

	return images;
}

async function main() {
	const { out } = parseArgs(process.argv.slice(2));
	const OUT = out ?? DEFAULT_OUT;

	await requireBinary("ffmpeg");
	await requireBinary("ffprobe");
	await requireBinary("google-chrome");

	const { featured, grid } = selectProjects(INFO.projects);
	console.log(
		`Building PDF: ${featured.length} featured, ${grid.length} in grid`
	);

	const images = await resolveImages([...featured, ...grid]);
	const html = renderDocument({
		info: INFO,
		featured,
		grid,
		imageFor: (project) => images.get(project) ?? null,
	});

	// Chrome needs a real file so that relative/absolute image paths resolve.
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "portfolio-pdf-"));
	const htmlFile = path.join(tmpDir, "portfolio.html");
	await fs.writeFile(htmlFile, html, "utf8");

	try {
		// Chrome writes harmless snap/libproxy warnings to stderr even on
		// success, so success is judged by exit code and output size only.
		await run("google-chrome", [
			"--headless",
			"--disable-gpu",
			"--no-pdf-header-footer",
			`--print-to-pdf=${OUT}`,
			`file://${htmlFile}`,
		]);
	} catch (error) {
		throw new Error(
			`Chrome failed to render the PDF.\n${error.stderr || error.message}`
		);
	}

	const stat = await fs.stat(OUT).catch(() => null);
	if (!stat || stat.size < 1024) {
		throw new Error(
			`Chrome produced no usable output at ${OUT} ` +
				`(${stat ? stat.size : 0} bytes). Expected a real document.`
		);
	}

	await fs.rm(tmpDir, { recursive: true, force: true });
	console.log(`Wrote ${OUT} (${Math.round(stat.size / 1024)} KB)`);
}

main().catch((error) => {
	console.error(`\nPortfolio PDF build failed:\n  ${error.message}\n`);
	process.exit(1);
});
