import React from "react";

import { faBriefcase } from "@fortawesome/free-solid-svg-icons";


import INFO from '../../data/user.js'; // import the work array
import Card from "../common/card";
import Work from "../common/work";

import "../common/styles/works.css";

const Works = () => {
	return (
		<div className="works">
			<Card
				icon={faBriefcase}
				title="Work"
				body={
					<div className="works-body">
						{INFO.work.map((item, index) => (
							<Work
								key={item.id}
								info={item}
							/>
						))}
					</div>
				}
			/>
		</div>
	);
};

export default Works;
