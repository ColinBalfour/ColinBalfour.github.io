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
