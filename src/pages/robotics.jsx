import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/robotics.css";

function LinkRenderer(props) {
	return (
	  <a href={props.href} target="_blank" rel="noreferrer">
		{props.children}
	  </a>
	);
  }

const Robotics = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "robotics");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Robotics | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="robotics" />
				<div className="content-wrapper">
					<div className="robotics-logo-container">
						<div className="robotics-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="robotics-container">
						<div className="robotics-main">
							<div className="robotics-right-side">
								<div className="title robotics-title">
									<ReactMarkdown components={{ a: LinkRenderer}}>{INFO.robotics.title}</ReactMarkdown>
								</div>

								<div className="subtitle robotics-subtitle">
									<ReactMarkdown components={{ a: LinkRenderer}}>{INFO.robotics.subtitle}</ReactMarkdown>
								</div>
                                
                                {/* loop over and render each "section" */}
                                {INFO.robotics.sections.map((section, index) => (
                                    <div key={index}>
                                        {/* only load when section.header isn't blank */}
                                        {section.header && (
                                            <div className="subtitle robotics-title">
                                                <h3><ReactMarkdown components={{ a: LinkRenderer}}>{section.header}</ReactMarkdown></h3>
                                            </div>
                                        )}

                                        {section.description && (
                                            <div className="subtitle robotics-body">
                                                <ReactMarkdown components={{ a: LinkRenderer}}>{section.description}</ReactMarkdown>
                                            </div>
                                        )}

                                        {section.bullet && (
                                            // loop over and render each bullet in the array
                                            <div className="subtitle robotics-bullet">
                                                <ul>
                                                {section.bullet.map((item, i) => (
                                                    <li key={i}><ReactMarkdown components={{ a: LinkRenderer}}>{item}</ReactMarkdown></li>
                                                ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}

							</div>

							<div className="robotics-left-side">
								<div className="robotics-image-container">
									<div className="robotics-image-wrapper">
										<img
											src="robotics1.jpg"
											alt="robotics"
											className="robotics-image"
										/>
									</div>
								</div>
                                <br/><br/><br/><br/>

                                <div className="robotics-image-container">
									<div className="robotics-image-wrapper">
										<video width="360" height="640" controls>
                                            <source src="robotics2.mp4" type="video/mp4" />
                                        </video>
									</div>

                                    <div>
                                        <p>Video of a single "swerve module" in action</p>
                                    </div>
								</div>
                                <br/><br/><br/><br/>

                                <div className="robotics-image-container">
									<div className="robotics-image-wrapper">
										<video width="360" height="640" controls>
                                            <source src="robotics3.mp4" type="video/mp4" />
                                        </video>
									</div>

                                    <div>
                                        <p>Video of the completed swerve base in action</p>
                                    </div>
								</div>
                                <br/><br/><br/><br/>

                                <div className="robotics-image-container">
									<div className="robotics-image-wrapper">
										<video width="360" height="390" controls>
                                            <source src="robotics4.mp4" type="video/mp4" />
                                        </video>
									</div>

                                    <div>
                                        <p>Video of the completed robot running fully autonomously</p>
                                    </div>
								</div>
                                <br/><br/><br/><br/>

							</div>
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Robotics;
