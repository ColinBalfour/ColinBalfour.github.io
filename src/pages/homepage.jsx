import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGithub,
	faStackOverflow,
	faInstagram,
	faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import Article from "../components/homepage/article";
import Works from "../components/homepage/works";
import AllProjects from "../components/projects/allProjects";

import INFO from "../data/user";
import SEO from "../data/seo";
import myArticles from "../data/articles";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [oldLogoSize, setOldLogoSize] = useState(80);

	// Carousel images for the third photo
	const carouselImages = ["/drone.png", "/sfm.png", "/pano.png", "/nerf.png"];
	const [nextImageIndex, setNextImageIndex] = useState(1);
	const [frontImageIndex, setFrontImageIndex] = useState(0);
	const [backImageIndex, setBackImageIndex] = useState(1);
	const [currentAnimation, setCurrentAnimation] = useState('flip-to-back');

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Carousel rotation effect using animation events
	useEffect(() => {
		const photoCard = document.querySelector('.photo-3 .photo-card');
		
		const handleAnimationStart = (e) => {
			if (e.animationName === 'flipToBack3') {
				// Starting to flip to back, set back to next image in sequence
				setBackImageIndex(nextImageIndex);
				setNextImageIndex((nextImageIndex + 1) % carouselImages.length);
			} else if (e.animationName === 'flipToFront3') {
				// Starting to flip to front, set front to next image in sequence
				setFrontImageIndex(nextImageIndex);
				setNextImageIndex((nextImageIndex + 1) % carouselImages.length);
			}
		};
		
		const handleAnimationEnd = (e) => {
			if (e.animationName === 'flipToBack3') {
				// Finished showing back, now flip back to front
				setCurrentAnimation('flip-to-front');
			} else if (e.animationName === 'flipToFront3') {
				// Finished showing front, now flip to back
				setCurrentAnimation('flip-to-back');
			}
		};

		if (photoCard) {
			photoCard.addEventListener('animationstart', handleAnimationStart);
			photoCard.addEventListener('animationend', handleAnimationEnd);
		}

		return () => {
			if (photoCard) {
				photoCard.removeEventListener('animationstart', handleAnimationStart);
				photoCard.removeEventListener('animationend', handleAnimationEnd);
			}
		};
	}, [carouselImages.length, nextImageIndex]);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			let newLogoSize = 80 - (scroll * 4) / 10;

			if (newLogoSize < oldLogoSize) {
				if (newLogoSize > 40) {
					setLogoSize(newLogoSize);
					setOldLogoSize(newLogoSize);
					setStayLogo(false);
				} else {
					setStayLogo(true);
				}
			} else {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [logoSize, oldLogoSize]);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="home" />
				<div className="content-wrapper">
					<div className="homepage-logo-container">
						<div style={logoStyle}>
							<Logo width={logoSize} link={false} />
						</div>
					</div>

					<div className="homepage-container">
						<div className="homepage-first-area">
							<div className="homepage-first-area-left-side">
								<div className="title homepage-title">
									{INFO.homepage.title}
								</div>

								<div className="subtitle homepage-subtitle">
									{INFO.homepage.description}
								</div>
							</div>

							<div className="homepage-first-area-right-side">
								<div className="homepage-image-container">
									<div className="hanging-photos">
										<div className="photo-wrapper photo-1">
											{/* pin + short string */}
											<span className="pin" aria-hidden="true"></span>
											<span className="string" aria-hidden="true"></span>

											<div className="photo-card">
												<img src="/homepage.jpg" alt="Portfolio 1 Front" />
												<img src="/about.jpg" alt="Portfolio 1 Back" />
											</div>
											</div>
										<div className="photo-wrapper photo-2">
											<div className="string"></div>
											<div className="photo-card">
												<img src="/flying.webp" alt="Portfolio 2 Front" />
												<img src="/apnews.png" alt="Portfolio 2 Back" />
											</div>
										</div>
										<div className="photo-wrapper photo-3">
											<div className="string"></div>
											<div className={`photo-card ${currentAnimation}`}>
												<img src={carouselImages[frontImageIndex]} alt={`Portfolio 3 - Front`} />
												<img src={carouselImages[backImageIndex]} alt={`Portfolio 3 - Back`} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="homepage-socials">
							{/* <a
								href={INFO.socials.twitter}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faTwitter}
									className="homepage-social-icon"
								/>
							</a> */}
							<a
								href={INFO.socials.github}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faGithub}
									className="homepage-social-icon"
								/>
							</a>
							{/* <a
								href={INFO.socials.stackoverflow}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faStackOverflow}
									className="homepage-social-icon"
								/>
							</a> */}
							<a
								href={INFO.socials.linkedin}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faLinkedin}
									className="homepage-social-icon"
								/>
							</a>
							{/* <a
								href={INFO.socials.instagram}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									className="homepage-social-icon"
								/>
							</a> */}
							<a
								href={`mailto:${INFO.main.email}`}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faMailBulk}
									className="homepage-social-icon"
								/>
							</a>
						</div>

						<div className="homepage-projects">
							<AllProjects />
						</div>

						<div className="homepage-after-title">
							{/* <div className="homepage-articles">
								{myArticles.map((article, index) => (
									<div
										className="homepage-article"
										key={(index + 1).toString()}
									>
										<Article
											key={(index + 1).toString()}
											date={article().date}
											title={article().title}
											description={article().description}
											link={"/article/" + (index + 1)}
										/>
									</div>
								))}
							</div> */}

							{/* <div className="homepage-works">
								<Works />
							</div> */}
						</div>

						<div className="page-footer">
							<Footer />
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;
