import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import INFO from "../../src/data/user.js";
import { selectProjects } from "./select.mjs";

const run = promisify(execFile);

// Chrome compresses page objects into object streams, so `/Type /Page` does
// not appear in the raw bytes (verified: returns 0 on a known 3-page file).
// The page-tree `/Count` does survive.
function pageCount(buffer) {
	const counts = [...buffer.toString("latin1").matchAll(/\/Count (\d+)/g)].map(
		(m) => Number(m[1])
	);
	return counts.length ? Math.max(...counts) : 0;
}

describe("portfolio PDF build", () => {
	let tempDir;
	let outPath;

	beforeAll(async () => {
		tempDir = await fs.mkdtemp(
			path.join(os.tmpdir(), "portfolio-pdf-test-")
		);
		outPath = path.join(tempDir, "portfolio.pdf");
		await run("node", [
			"scripts/build-portfolio-pdf.mjs",
			"--out",
			outPath,
		]);
	}, 120000);

	afterAll(async () => {
		if (tempDir) await fs.rm(tempDir, { recursive: true, force: true });
	});

	it("writes a non-trivial PDF", async () => {
		const stat = await fs.stat(outPath);
		expect(stat.size).toBeGreaterThan(10 * 1024);
	});

	it("has one page per featured project plus one per six grid projects", async () => {
		const { featured, grid } = selectProjects(INFO.projects);
		const expected = featured.length + Math.ceil(grid.length / 6);

		const buffer = await fs.readFile(outPath);
		expect(pageCount(buffer)).toBe(expected);
	});
});
