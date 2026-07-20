import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import "./styles/allProjects.css";

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
							description={
								variant === "short" && project.tagline
									? project.tagline
									: project.description
							}
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
