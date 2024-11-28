import React from "react";

import "../common/styles/works.css";

const Work = ({info}) => {
	return (
		<div className="work">
			<div className="work-info">
				<img
					src={info.src}
					alt={info.alt}
					className="work-image"
				/>
				<div className="work-title">{info.title}</div>
			</div>
			<div className="work-info">
				<div className="work-subtitle">{info.subtitle}</div>
				<div className="work-duration">{info.duration}</div>
			</div>
		</div>
	);
};

export default Work;