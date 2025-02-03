import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	let { logos, title, description, photo, linkText, link, page, idx } = props;

	if (link === "/projects/") {
	    link = `/projects/${idx+1}`;
	}

	let inner = (
		<div className="project-container">
			<div className="project-logo">
				{logos.map((logo, index) => (
					<img key={index} src={logo} alt="logo" />
				))}
			</div>
			<div className="project-title">{title}</div>
	
			{/* conditionally write photo if it's supplied */}
			{ photo && (
				<div className="project-photo">
					<img src={photo} alt="" />
				</div>
			)}
	
			<div className="project-description">{description}</div>
			{/* conditionally write link if it's supplied */}
			{link && (
			<div className="project-link">
				<div className="project-link-icon">
					<FontAwesomeIcon icon={faLink} />
				</div>
	
				<div className="project-link-text">{linkText}</div>
			</div>
			)}
		</div>
	);

	return (
		<React.Fragment>
			<div className="project">
				{link ? (
					<Link to={link} {...(page ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
						{inner}
					</Link>
				) : (
					inner
				)}
			</div>
		</React.Fragment>
	);
};

export default Project;
