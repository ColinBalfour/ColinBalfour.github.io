import React from "react";

import Project from "./project";

import INFO from "../../data/user";

import "./styles/allProjects.css";

const AllProjects = () => {
	return (
		<div className="all-projects-container">
			{INFO.projects.map((project, index) => {
				return (
					<div className="all-projects-project" key={index}>
						<Project
							logos={project.logo}
							title={project.title}
							description={project.description}
							photo={project.photo}
							linkText={project.linkText}
							link={project.link}
							page={project.page}
							idx = {index}
						/>
					</div>
				)
			})}
		</div>
	);
};

export default AllProjects;
