import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import "./styles/project.css";

const Project = (props) => {
	const { logos, title, description, photo, linkText, link, page } = props;

	return (
		<React.Fragment>
			<div className="project">
				<Link to={link} {...(page ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
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
								<img src={photo} alt="photo" />
							</div>
						)}

						<div className="project-description">{description}</div>
						<div className="project-link">
							<div className="project-link-icon">
								<FontAwesomeIcon icon={faLink} />
							</div>

							<div className="project-link-text">{linkText}</div>
						</div>
					</div>
				</Link>
			</div>
		</React.Fragment>
	);
};

export default Project;
