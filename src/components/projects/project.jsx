import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import Media from "../common/media";
import "./styles/project.css";

const Project = (props) => {
	let { logos, title, description, photo, linkText, link, page, idx, slug } = props;

	// Internal project pages use the sentinel link "/projects/". Prefer a stable
	// named slug; fall back to the 1-based index only if no slug is defined.
	if (link === "/projects/") {
	    link = `/projects/${slug ?? idx + 1}`;
	}

	// Same-site routes navigate in-app; external URLs open in a new tab.
	const isInternal = !!page || (typeof link === "string" && link.startsWith("/"));

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
					<Media src={photo} alt="" />
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
					<Link
						to={link}
						{...(isInternal
							? {}
							: { target: "_blank", rel: "noopener noreferrer" })}
					>
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
