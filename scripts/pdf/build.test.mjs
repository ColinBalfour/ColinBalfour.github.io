import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import INFO from "../../src/data/user.js";
import { selectProjects } from "./select.mjs";

const run = promisify(execFile);

const CLI = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../build-portfolio-pdf.mjs"
);

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
		await run("node", [CLI, "--out", outPath]);
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

describe("a failed write cannot be reported as success over a stale file", () => {
	it("exits non-zero and leaves the stale file untouched when the out dir is read-only", async () => {
		const roDir = await fs.mkdtemp(
			path.join(os.tmpdir(), "portfolio-pdf-readonly-")
		);
		const stalePath = path.join(roDir, "old.pdf");
		const staleContents = "stale-pdf-contents".repeat(4096); // ~70KB
		await fs.writeFile(stalePath, staleContents);
		const staleMd5Before = await run("md5sum", [stalePath]).then(
			(r) => r.stdout.split(" ")[0]
		);

		await fs.chmod(stalePath, 0o444);
		await fs.chmod(roDir, 0o555);

		try {
			let error = null;
			try {
				await run("node", [CLI, "--out", stalePath]);
			} catch (e) {
				error = e;
			}

			expect(error).not.toBeNull();
			expect(error.code).not.toBe(0);

			const staleMd5After = await run("md5sum", [stalePath]).then(
				(r) => r.stdout.split(" ")[0]
			);
			expect(staleMd5After).toBe(staleMd5Before);
			const staleAfter = await fs.readFile(stalePath, "utf8");
			expect(staleAfter).toBe(staleContents);
		} finally {
			await fs.chmod(roDir, 0o755);
			await fs.chmod(stalePath, 0o644).catch(() => {});
			await fs.rm(roDir, { recursive: true, force: true });
		}
	}, 120000);
});
