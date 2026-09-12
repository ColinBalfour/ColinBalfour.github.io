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
