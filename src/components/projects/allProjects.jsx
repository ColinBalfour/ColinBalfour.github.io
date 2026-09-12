import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import "./styles/allProjects.css";

// Prefix card text with the project's `date` field, e.g. "(2024-2025) ...".
const withDate = (text, date) => (date ? `(${date}) ${text}` : text);

// variant="short" renders each project's punchy `tagline` (falling back to the
// full description) — used on the homepage; the projects page shows the full text.
const AllProjects = ({ variant }) => {
	return (
		<div className="all-projects-container">
			{INFO.projects.map((project, index) => {
				return (
					<div className="all-projects-project" key={index}>
						<Project
							logos={project.logo}
							title={project.title}
							description={withDate(
								variant === "short" && project.tagline
									? project.tagline
									: project.description,
								project.date
							)}
							photo={project.photo}
							linkText={project.linkText}
							link={project.link}
							page={project.page}
							slug={project.slug}
							idx = {index}
						/>
					</div>
				)
			})}
		</div>
	);
};

export default AllProjects;
