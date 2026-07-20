import React from "react";

import "../common/styles/works.css";

// `info.wide` selects a wider container for horizontal wordmark logos
// (NVIDIA, Magna, ...); square/round emblem logos use the default square tile.
const Work = ({ info }) => {
	return (
		<div className="work">
			<img
				src={info.src}
				alt={info.alt}
				className={"work-image" + (info.wide ? " wide" : "")}
			/>
			<div className="work-body">
				<div className="work-header">
					<div className="work-title">{info.title}</div>
					<div className="work-duration">{info.duration}</div>
				</div>
				<div className="work-subtitle">{info.subtitle}</div>
			</div>
		</div>
	);
};

export default Work;
