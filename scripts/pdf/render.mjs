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
