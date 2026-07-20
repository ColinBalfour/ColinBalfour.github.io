import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/publications.css";

// Render an author string, emphasizing "Colin Balfour".
const Authors = ({ authors }) => {
	const parts = authors.split(/(Colin Balfour)/g);
	return (
		<span>
			{parts.map((part, i) =>
				part === "Colin Balfour" ? (
					<strong key={i}>{part}</strong>
				) : (
					<React.Fragment key={i}>{part}</React.Fragment>
				)
			)}
		</span>
	);
};

const Publications = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "publications");
	const publications = INFO.publications || [];

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Publications | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="publications" />
				<div className="content-wrapper">
					<div className="publications-logo-container">
						<div className="publications-logo">
							<Logo width={46} />
						</div>
					</div>
					<div className="publications-container">
						<div className="title publications-title">
							Publications
						</div>

						<div className="subtitle publications-subtitle">
							Peer-reviewed and in-review research on perception and
							autonomous flight, from my work at WPI's PeAR Lab.
						</div>

						<div className="publications-list">
							{publications.map((pub, index) => {
								const primaryUrl =
									(pub.links &&
										pub.links[0] &&
										pub.links[0].url) ||
									pub.link ||
									"";

								return (
									<div className="publication" key={index}>
										{pub.image &&
											(primaryUrl ? (
												<a
													className="publication-media"
													href={primaryUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src={pub.image}
														alt={pub.title}
														loading="lazy"
													/>
												</a>
											) : (
												<div className="publication-media">
													<img
														src={pub.image}
														alt={pub.title}
														loading="lazy"
													/>
												</div>
											))}

										<div className="publication-content">
											<div className="publication-meta">
												<span
													className={
														"publication-badge " +
														(pub.status ===
														"Published"
															? "published"
															: "in-review")
													}
												>
													{pub.status}
												</span>
												<span className="publication-venue">
													{pub.venue} · {pub.year}
												</span>
											</div>

											<div className="publication-title">
												{primaryUrl ? (
													<a
														href={primaryUrl}
														target="_blank"
														rel="noopener noreferrer"
													>
														{pub.title}
													</a>
												) : (
													pub.title
												)}
											</div>

											<div className="publication-authors">
												<Authors authors={pub.authors} />
											</div>

											{pub.blurb && (
												<div className="publication-blurb">
													{pub.blurb}
												</div>
											)}

											{pub.note && (
												<div className="publication-note">
													{pub.note}
												</div>
											)}

											{pub.links &&
												pub.links.length > 0 && (
													<div className="publication-links">
														{pub.links.map(
															(l, i) => (
																<a
																	className="publication-link-btn"
																	href={l.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	key={i}
																>
																	{l.label}
																	<FontAwesomeIcon
																		icon={
																			faArrowUpRightFromSquare
																		}
																		className="publication-link-btn-icon"
																	/>
																</a>
															)
														)}
													</div>
												)}
										</div>
									</div>
								);
							})}
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

export default Publications;
