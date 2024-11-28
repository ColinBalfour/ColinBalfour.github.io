import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/learning.css";

const Learning = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// const currentSEO = SEO.find((item) => item.page === "learning");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Learning | ${INFO.main.title}`}</title>
				{/* <meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/> */}
			</Helmet>

			<div className="page-content">
				<NavBar active="learning" />
				<div className="content-wrapper">
					<div className="learning-logo-container">
						<div className="learning-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="learning-container">
						<div className="learning-main">
							<div className="learning-right-side">
								<div className="title learning-title">
									<ReactMarkdown>{INFO.learning.title}</ReactMarkdown>
								</div>

								<div className="subtitle learning-subtitle">
									<ReactMarkdown>{INFO.learning.subtitle}</ReactMarkdown>
								</div>

								<div className="body learning-body">
									<ReactMarkdown>{INFO.learning.description}</ReactMarkdown>
								</div>

							</div>

							<div className="learning-left-side">
								<div className="learning-image-container">
									<div className="learning-image-wrapper">
										<img
											src="learning1.jpg"
											alt="learning"
											className="learning-image"
										/>
									</div>
								</div>
								The book I used to learn calculus my sophomore year. It's often used in intro analysis courses due to its heavy emphasis on proofs -- fantastic book and would 100% recommend.
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

export default Learning;
