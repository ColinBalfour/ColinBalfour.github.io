import React from "react";

import { faSchool } from "@fortawesome/free-solid-svg-icons";


import INFO from '../../data/user.js'; // import the work array
import Card from "../common/card";
import Work from "../common/work";

import "../common/styles/works.css";

const Educations = () => {
	return (
		<div className="education">
			<Card
				icon={faSchool}
				title="Education"
				body={
					<div className="works-body">
						{INFO.education.map((item, index) => (
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

export default Educations;
