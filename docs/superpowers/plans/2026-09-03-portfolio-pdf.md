# Portfolio PDF Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a print-ready portfolio PDF at `public/ColinBalfourPortfolio.pdf` from the project data already in `src/data/user.js`, via `npm run pdf`.

**Architecture:** A four-stage Node pipeline. Three pure/filesystem modules under `scripts/pdf/` (select → posters → render) are unit-tested without a browser; a thin orchestrator `scripts/build-portfolio-pdf.mjs` wires them together and shells out to `ffmpeg` (video → still frame) and headless `google-chrome` (HTML → PDF). No new npm dependencies.

**Tech Stack:** Node 20 ESM (`"type": "module"`), Vitest, system `google-chrome` 145, system `ffmpeg`/`ffprobe`.

**Spec:** `docs/superpowers/specs/2026-09-03-portfolio-pdf-design.md`

## Global Constraints

- **No new npm dependencies.** Puppeteer is explicitly rejected; use the installed `google-chrome` binary.
- **All files are ESM.** `package.json` sets `"type": "module"`. Use `import`, not `require`.
- **Files containing JSX must be `.jsx`.** None here do; all new files are `.mjs`.
- **Prettier config: tabs, width 4.** Match surrounding style.
- **The generator must not alter site rendering or the visitor bundle.** Nothing under `src/` changes except two additive data fields in `src/data/user.js`.
- **Page geometry: US Letter, 0.6in margins.**
- **Back grid: 6 items per page** (2 columns × 3 rows).
- **Featured set (5), in this order:** Saranga, ActiveNav, AttentionSeeker, Learning to Chase, Einstein Vision. The MQP (`slug: "agile-event-flight"`) is deliberately excluded.
- **Chrome success is judged by exit code + output size, never by empty stderr** — Chrome emits harmless snap/libproxy warnings to stderr on success in this environment.
- **PDF page count is read as the maximum `/Count <n>` in the PDF bytes.** Counting `/Type /Page` does not work; Chrome compresses page objects into object streams.

---

### Task 1: Project selection

Pure partition of the projects array into the full-page tier and the back-grid tier.

**Files:**
- Create: `scripts/pdf/select.mjs`
- Test: `scripts/pdf/select.test.mjs`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `selectProjects(projects: Array<object>) => { featured: Array<object>, grid: Array<object> }`. Throws `Error` when nothing is flagged. Used by Task 4.

- [ ] **Step 1: Write the failing test**

Create `scripts/pdf/select.test.mjs`:

```js
import { describe, it, expect } from "vitest";
import { selectProjects } from "./select.mjs";

const p = (title, flags = {}) => ({ title, ...flags });

describe("selectProjects", () => {
	it("puts pdfFeatured projects in featured, pdf-only in grid, and drops the rest", () => {
		const projects = [
			p("Featured One", { pdfFeatured: true }),
			p("Unflagged"),
			p("Grid One", { pdf: true }),
			p("Featured Two", { pdfFeatured: true }),
		];

		const { featured, grid } = selectProjects(projects);

		expect(featured.map((x) => x.title)).toEqual([
			"Featured One",
			"Featured Two",
		]);
		expect(grid.map((x) => x.title)).toEqual(["Grid One"]);
	});

	it("treats pdfFeatured as implying inclusion even without pdf: true", () => {
		const { featured, grid } = selectProjects([
			p("Only Featured", { pdfFeatured: true }),
		]);
		expect(featured).toHaveLength(1);
		expect(grid).toHaveLength(0);
	});

	it("preserves array order rather than re-sorting", () => {
		const { featured } = selectProjects([
			p("Third", { pdfFeatured: true }),
			p("First", { pdfFeatured: true }),
			p("Second", { pdfFeatured: true }),
		]);
		expect(featured.map((x) => x.title)).toEqual([
			"Third",
			"First",
			"Second",
		]);
	});

	it("throws rather than emitting an empty document when nothing is flagged", () => {
		expect(() => selectProjects([p("A"), p("B")])).toThrow(
			/no projects flagged/i
		);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/pdf/select.test.mjs`
Expected: FAIL — cannot resolve `./select.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/pdf/select.mjs`:

```js
// Partitions the site's projects into the PDF's two tiers.
//
// `pdfFeatured` gets a full page; `pdf` alone lands in the back grid.
// Array order is preserved so the PDF inherits the ranking already
// expressed on the site — there is no separate ordering config to drift.
export function selectProjects(projects) {
	const featured = [];
	const grid = [];

	for (const project of projects) {
		if (project.pdfFeatured) featured.push(project);
		else if (project.pdf) grid.push(project);
	}

	if (featured.length === 0 && grid.length === 0) {
		throw new Error(
			"No projects flagged for the PDF. Set `pdf: true` or " +
				"`pdfFeatured: true` on at least one project in src/data/user.js."
		);
	}

	return { featured, grid };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/pdf/select.test.mjs`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/pdf/select.mjs scripts/pdf/select.test.mjs
git commit -m "feat(pdf): partition projects into featured and grid tiers"
```

---

### Task 2: Poster frames from video thumbnails

Six projects site-wide use an `.mp4` as their `photo`, two of them in the featured set. A PDF cannot embed video, so each needs a still frame.

**Files:**
- Create: `scripts/pdf/posters.mjs`
- Test: `scripts/pdf/posters.test.mjs`
- Modify: `.gitignore` (add `.pdf-cache/`)

**Interfaces:**
- Consumes: nothing.
- Produces, all used by Task 4:
  - `isVideo(src: string) => boolean`
  - `posterPath(src: string, cacheDir: string) => string` — absolute path of the cached still
  - `seekSeconds(durationSeconds: number, at?: string) => number` — 40% default, or a parsed `"m:ss"` override
  - `ensurePoster(src, { publicDir, cacheDir, at }) => Promise<string|null>` — absolute jpg path, or `null` on failure

- [ ] **Step 1: Write the failing test**

Create `scripts/pdf/posters.test.mjs`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/pdf/posters.test.mjs`
Expected: FAIL — cannot resolve `./posters.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/pdf/posters.mjs`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/pdf/posters.test.mjs`
Expected: PASS, 7 tests.

- [ ] **Step 5: Verify extraction works on real footage**

Run:

```bash
node --input-type=module -e "
import { ensurePoster } from './scripts/pdf/posters.mjs';
const out = await ensurePoster('/selfplay_fpv_pursuit.mp4', {
  publicDir: 'public', cacheDir: '.pdf-cache'
});
console.log(out);
"
ls -la .pdf-cache/
```

Expected: prints a path, and `.pdf-cache/selfplay_fpv_pursuit.jpg` exists at a non-zero size.

- [ ] **Step 6: Ignore the cache directory**

Append to `.gitignore` (the file must keep a trailing newline — a previous edit fused onto `yarn.lock` for lack of one):

```
.pdf-cache/
```

- [ ] **Step 7: Commit**

```bash
git add scripts/pdf/posters.mjs scripts/pdf/posters.test.mjs .gitignore
git commit -m "feat(pdf): extract poster frames from video thumbnails via ffmpeg"
```

---

### Task 3: HTML rendering

Builds the entire print document as one standalone HTML string. Authored for paper, deliberately unrelated to the site's dark, scroll-driven, video-first screen CSS.

**Files:**
- Create: `scripts/pdf/render.mjs`
- Test: `scripts/pdf/render.test.mjs`

**Interfaces:**
- Consumes: nothing (takes plain data).
- Produces, used by Task 4:
  - `escapeHtml(value: string) => string`
  - `chunk(items: Array, size: number) => Array<Array>`
  - `renderDocument({ info, featured, grid, imageFor }) => string` where `imageFor(project) => string|null` returns an absolute image path (or `null` for a text-only card)

- [ ] **Step 1: Write the failing test**

Create `scripts/pdf/render.test.mjs`:

```js
import { describe, it, expect } from "vitest";
import { escapeHtml, chunk, renderDocument } from "./render.mjs";

const INFO = {
	main: { name: "Colin Balfour", email: "colin.balfour@gmail.com" },
	homepage: { title: "Robotics — perception & autonomy" },
	socials: {
		github: "https://github.com/ColinBalfour",
		linkedin: "https://www.linkedin.com/in/colin-d-balfour/",
	},
};

const project = (over = {}) => ({
	title: "A Project",
	tagline: "A tagline.",
	description: "A description.",
	photo: "/a.jpg",
	...over,
});

describe("escapeHtml", () => {
	it("escapes the characters that actually occur in these titles", () => {
		expect(
			escapeHtml("[Under Review — RA-L 2026] Ampersand & <b>")
		).toBe("[Under Review — RA-L 2026] Ampersand &amp; &lt;b&gt;");
	});

	it("escapes quotes so attribute interpolation is safe", () => {
		expect(escapeHtml(`say "hi"`)).toBe("say &quot;hi&quot;");
	});

	it("renders nullish values as empty string", () => {
		expect(escapeHtml(undefined)).toBe("");
		expect(escapeHtml(null)).toBe("");
	});
});

describe("chunk", () => {
	it("splits the grid into pages of six", () => {
		expect(chunk([1, 2, 3, 4, 5, 6, 7], 6)).toEqual([
			[1, 2, 3, 4, 5, 6],
			[7],
		]);
	});

	it("returns nothing for an empty list", () => {
		expect(chunk([], 6)).toEqual([]);
	});
});

describe("renderDocument", () => {
	const imageFor = (p) => (p.photo ? `/abs${p.photo}` : null);

	it("emits the masthead once, with name and contact details", () => {
		const html = renderDocument({
			info: INFO,
			featured: [project()],
			grid: [],
			imageFor,
		});
		expect(html.match(/class="masthead"/g)).toHaveLength(1);
		expect(html).toContain("Colin Balfour");
		expect(html).toContain("colin.balfour@gmail.com");
	});

	it("carries the affiliations line from education and work", () => {
		const html = renderDocument({
			info: {
				...INFO,
				education: [{ alt: "WPI" }],
				work: [{ alt: "NVIDIA" }, { alt: "PeAR" }, { alt: "Magna" }],
			},
			featured: [project()],
			grid: [],
			imageFor,
		});
		expect(html).toContain("WPI · NVIDIA · PeAR");
		expect(html).not.toContain("Magna");
	});

	it("still emits the masthead when only grid projects are flagged", () => {
		const html = renderDocument({
			info: INFO,
			featured: [],
			grid: [project()],
			imageFor,
		});
		expect(html.match(/class="masthead"/g)).toHaveLength(1);
	});

	it("renders one page per featured project", () => {
		const html = renderDocument({
			info: INFO,
			featured: [
				project({ title: "One" }),
				project({ title: "Two" }),
			],
			grid: [],
			imageFor,
		});
		expect(html.match(/class="page"/g)).toHaveLength(2);
	});

	it("escapes project titles rather than injecting raw markup", () => {
		const html = renderDocument({
			info: INFO,
			featured: [project({ title: "Tom & <script>alert(1)</script>" })],
			grid: [],
			imageFor,
		});
		expect(html).toContain("Tom &amp;");
		expect(html).not.toContain("<script>alert(1)</script>");
	});

	it("renders a text-only card when no image is available", () => {
		const html = renderDocument({
			info: INFO,
			featured: [project({ photo: undefined })],
			grid: [],
			imageFor,
		});
		expect(html).toContain("A Project");
		expect(html).not.toContain("<img");
	});

	it("adds one grid page per six grid projects", () => {
		const grid = Array.from({ length: 7 }, (_, i) =>
			project({ title: `Grid ${i}` })
		);
		const html = renderDocument({
			info: INFO,
			featured: [project()],
			grid,
			imageFor,
		});
		// 1 featured page + 2 grid pages
		expect(html.match(/class="page"/g)).toHaveLength(3);
	});

	it("sets Letter geometry and forces background printing", () => {
		const html = renderDocument({
			info: INFO,
			featured: [project()],
			grid: [],
			imageFor,
		});
		expect(html).toMatch(/size:\s*letter/i);
		expect(html).toContain("print-color-adjust: exact");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/pdf/render.test.mjs`
Expected: FAIL — cannot resolve `./render.mjs`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/pdf/render.mjs`:

```js
// Builds the print document as a single standalone HTML string.
//
// This layout is authored for paper and is intentionally unrelated to the
// site's screen CSS, which is dark, scroll-driven and video-first — none of
// which serves a printed page.

const GRID_PER_PAGE = 6;

export function escapeHtml(value) {
	if (value === null || value === undefined) return "";
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export function chunk(items, size) {
	const out = [];
	for (let i = 0; i < items.length; i += size) {
		out.push(items.slice(i, i + size));
	}
	return out;
}

const STYLES = `
	@page { size: letter; margin: 0.6in; }
	* { box-sizing: border-box; }
	body {
		margin: 0;
		font-family: Georgia, "Times New Roman", serif;
		color: #16181d;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}
	.page {
		page-break-after: always;
		display: flex;
		flex-direction: column;
		height: 9.8in;
	}
	.page:last-child { page-break-after: auto; }
	.masthead {
		background: #16181d;
		color: #fff;
		padding: 20px 24px;
		margin-bottom: 26px;
	}
	.masthead .name {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.4px;
	}
	.masthead .role { font-size: 12px; color: #c3c9d4; margin-top: 4px; }
	.masthead .affil {
		font-size: 10px;
		color: #e8ebf0;
		margin-top: 9px;
		letter-spacing: 0.3px;
	}
	.masthead .links { font-size: 9.5px; color: #8c94a1; margin-top: 6px; }
	.ptitle { font-size: 19px; font-weight: 700; line-height: 1.25; }
	.tagline {
		font-size: 11.5px;
		font-style: italic;
		color: #555;
		margin-top: 6px;
	}
	.hero {
		margin: 16px 0;
		width: 100%;
		max-height: 4.3in;
		object-fit: cover;
		border-radius: 3px;
	}
	.desc { font-size: 11px; line-height: 1.6; }
	.foot {
		margin-top: auto;
		border-top: 1px solid #e2e2e2;
		padding-top: 6px;
		font-size: 8px;
		color: #999;
		display: flex;
		justify-content: space-between;
	}
	.grid-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.cell img {
		width: 100%;
		height: 1.5in;
		object-fit: cover;
		border-radius: 2px;
	}
	.cell .ct { font-size: 11px; font-weight: 700; margin-top: 6px; }
	.cell .cg { font-size: 9px; color: #666; margin-top: 3px; }
`;

function footer(info, pageNumber) {
	return `<div class="foot">
		<span>${escapeHtml(info.main.name)} · ${escapeHtml(info.main.email)}</span>
		<span>${pageNumber}</span>
	</div>`;
}

function masthead(info) {
	const links = [
		info.main.email,
		(info.socials.github || "").replace(/^https?:\/\//, ""),
		(info.socials.linkedin || "").replace(/^https?:\/\//, ""),
	]
		.filter(Boolean)
		.join(" · ");

	// Keeps the one thing a dedicated cover page would have carried:
	// current school and the two most recent affiliations (WPI · NVIDIA · PeAR).
	const affiliations = [
		info.education?.[0]?.alt,
		...(info.work || []).slice(0, 2).map((w) => w.alt),
	]
		.filter(Boolean)
		.join(" · ");

	return `<div class="masthead">
		<div class="name">${escapeHtml(info.main.name)}</div>
		<div class="role">${escapeHtml(info.homepage.title)}</div>
		<div class="affil">${escapeHtml(affiliations)}</div>
		<div class="links">${escapeHtml(links)}</div>
	</div>`;
}

function featuredPage(project, info, imageFor, pageNumber, withMasthead) {
	const image = imageFor(project);
	return `<section class="page">
		${withMasthead ? masthead(info) : ""}
		<div class="ptitle">${escapeHtml(project.title)}</div>
		<div class="tagline">${escapeHtml(project.tagline)}</div>
		${image ? `<img class="hero" src="${escapeHtml(image)}" alt="">` : ""}
		<div class="desc">${escapeHtml(project.description)}</div>
		${footer(info, pageNumber)}
	</section>`;
}

function gridPage(
	projects,
	info,
	imageFor,
	pageNumber,
	isFirstGridPage,
	withMasthead = false
) {
	const cells = projects
		.map((project) => {
			const image = imageFor(project);
			return `<div class="cell">
				${image ? `<img src="${escapeHtml(image)}" alt="">` : ""}
				<div class="ct">${escapeHtml(project.title)}</div>
				<div class="cg">${escapeHtml(project.tagline)}</div>
			</div>`;
		})
		.join("");

	return `<section class="page">
		${withMasthead ? masthead(info) : ""}
		${isFirstGridPage ? `<div class="grid-title">More work</div>` : ""}
		<div class="grid">${cells}</div>
		${footer(info, pageNumber)}
	</section>`;
}

export function renderDocument({ info, featured, grid, imageFor }) {
	let pageNumber = 0;

	const featuredPages = featured.map((project, i) =>
		featuredPage(project, info, imageFor, ++pageNumber, i === 0)
	);

	// The masthead belongs on the first page of the document, whichever tier
	// that is — flagging only grid projects must not leave the PDF unattributed.
	const gridPages = chunk(grid, GRID_PER_PAGE).map((page, i) =>
		gridPage(
			page,
			info,
			imageFor,
			++pageNumber,
			i === 0,
			featured.length === 0 && i === 0
		)
	);

	return `<!doctype html>
<html><head><meta charset="utf-8">
<title>${escapeHtml(info.main.name)} — Portfolio</title>
<style>${STYLES}</style>
</head><body>
${[...featuredPages, ...gridPages].join("\n")}
</body></html>`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/pdf/render.test.mjs`
Expected: PASS, 14 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/pdf/render.mjs scripts/pdf/render.test.mjs
git commit -m "feat(pdf): render the print document as standalone HTML"
```

---

### Task 4: Orchestrator and `npm run pdf`

Wires the three modules together, resolves poster frames, invokes Chrome, and fails loudly.

**Files:**
- Create: `scripts/build-portfolio-pdf.mjs`
- Modify: `package.json` (add the `pdf` script)

**Interfaces:**
- Consumes: `selectProjects` (Task 1); `isVideo`, `ensurePoster` (Task 2); `renderDocument` (Task 3).
- Produces: the CLI entry point, and `public/ColinBalfourPortfolio.pdf`.

- [ ] **Step 1: Write the orchestrator**

Create `scripts/build-portfolio-pdf.mjs`:

```js
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
const OUT = path.join(PUBLIC_DIR, "ColinBalfourPortfolio.pdf");

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
	await requireBinary("ffmpeg");
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
```

- [ ] **Step 2: Verify it fails loudly before any project is flagged**

Run: `node scripts/build-portfolio-pdf.mjs`
Expected: exits non-zero with "No projects flagged for the PDF." — no PDF is written. This confirms the empty-document guard before Task 5 flags anything.

- [ ] **Step 3: Add the npm script**

In `package.json`, add to `"scripts"` (keep tabs, alphabetical neighbours intact):

```json
"pdf": "node scripts/build-portfolio-pdf.mjs",
```

- [ ] **Step 4: Commit**

```bash
git add scripts/build-portfolio-pdf.mjs package.json
git commit -m "feat(pdf): add build orchestrator and npm run pdf"
```

---

### Task 5: Flag the featured projects and verify end to end

Turns the pipeline on against real data and asserts the produced document.

**Files:**
- Modify: `src/data/user.js` (add `pdfFeatured: true` to 5 projects)
- Create: `scripts/pdf/build.test.mjs`

**Interfaces:**
- Consumes: everything above.
- Produces: `public/ColinBalfourPortfolio.pdf`.

- [ ] **Step 1: Flag the five featured projects**

In `src/data/user.js`, add the line `pdfFeatured: true,` immediately after the `linkText:` line of each of these five entries, identified by title:

1. `[Science Robotics 2026] Saranga: milliWatt Ultrasound Navigation on Palm-Sized Drones`
2. `[Under Review — ICRA 2027] ActiveNav: Learning Active Monocular Flight in Forests`
3. `[Under Review — RA-L 2026] AttentionSeeker: Passive Attention-Based Aerial Navigation with Events`
4. `Learning to Chase: Vision-Based Drone Pursuit and Adversarial Self-Play`
5. `Einstein Vision: a Full-Self Driving Perception Stack`

Do **not** flag `Agile Event-based Flight through Cluttered Environments` (the MQP) — its exclusion is deliberate.

Verify the flags landed on exactly the right five:

```bash
node --input-type=module -e "
import INFO from './src/data/user.js';
INFO.projects.filter(p=>p.pdfFeatured).forEach(p=>console.log('*', p.title));
"
```

Expected: exactly the five titles above, in that order.

- [ ] **Step 2: Write the failing integration test**

Create `scripts/pdf/build.test.mjs`:

```js
import { describe, it, expect, beforeAll } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

import INFO from "../../src/data/user.js";
import { selectProjects } from "./select.mjs";

const run = promisify(execFile);
const OUT = "public/ColinBalfourPortfolio.pdf";

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
	beforeAll(async () => {
		await run("node", ["scripts/build-portfolio-pdf.mjs"]);
	}, 120000);

	it("writes a non-trivial PDF", async () => {
		const stat = await fs.stat(OUT);
		expect(stat.size).toBeGreaterThan(10 * 1024);
	});

	it("has one page per featured project plus one per six grid projects", async () => {
		const { featured, grid } = selectProjects(INFO.projects);
		const expected = featured.length + Math.ceil(grid.length / 6);

		const buffer = await fs.readFile(OUT);
		expect(pageCount(buffer)).toBe(expected);
	});
});
```

- [ ] **Step 3: Run the integration test**

Run: `npx vitest run scripts/pdf/build.test.mjs`
Expected: PASS, 2 tests. With 5 featured and an empty grid, the page count is 5.

- [ ] **Step 4: Look at the actual PDF**

Run: `xdg-open public/ColinBalfourPortfolio.pdf` (or open it however is convenient).

Confirm by eye, because no assertion covers these: the masthead appears once on page 1 above Saranga; each of the five projects has a legible hero image; the two poster frames (AttentionSeeker, Learning to Chase) show a representative moment rather than a black or blurred frame; and no text is clipped at a page boundary. If a poster frame is poor, set `pdfPosterAt: "0:02"` on that project and re-run.

- [ ] **Step 5: Run the full suite**

Run: `npx vitest run`
Expected: all pre-existing tests still pass (48 before this work), plus the new ones. Confirms nothing here disturbed the site.

- [ ] **Step 6: Commit**

```bash
git add src/data/user.js scripts/pdf/build.test.mjs public/ColinBalfourPortfolio.pdf
git commit -m "feat(pdf): flag featured projects and verify the generated document"
```

---

## Notes for the executor

- **Do not** add Puppeteer, Playwright, or a PDF library. The whole design rests on using binaries that are already installed.
- If `google-chrome` is missing but `chromium` exists, change the binary name in one place (`requireBinary` and the `run` call in Task 4) rather than restructuring.
- `.pdf-cache/` is derived output and is gitignored; `public/ColinBalfourPortfolio.pdf` is a committed artifact, consistent with how `BalfourResume.pdf` is already handled.
- The site's dev server and the visual-companion server may be running from an earlier session; neither affects these tasks.
