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
