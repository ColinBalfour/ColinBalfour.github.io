import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { faMailBulk, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faGithub,
	faLinkedin,
	faGoogleScholar,
	faOrcid,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";
import AllProjects from "../components/projects/allProjects";
import FlippingPhoto from "../components/homepage/flippingPhoto";
import VideoPlayer from "../components/homepage/videoPlayer";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/homepage.css";

const Homepage = () => {
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(80);
	const [oldLogoSize, setOldLogoSize] = useState(80);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 2);

			// Keep the scroll cue up until the projects grid actually enters
			// the viewport, then fade it out.
			const projects = document.querySelector(".homepage-projects");
			setScrolled(
				projects
					? projects.getBoundingClientRect().top <
							window.innerHeight * 0.8
					: scroll > 60
			);

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
								{INFO.homepage.status && (
									<div className="homepage-status">
										<span className="homepage-status-dot"></span>
										{INFO.homepage.status}
									</div>
								)}
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
										<FlippingPhoto
											images={["/homepage.jpg", "/about.jpg"]}
											links={[
												INFO.socials.linkedin,
												INFO.socials.linkedin,
											]}
											photoNumber={1}
											animationDelay={0}
											animationDuration={8}
											pendulumDuration={6}
										/>
										<FlippingPhoto
											images={["/flying.webp", "/apnews.png"]}
											links={[
												"https://apnews.com/article/bat-robots-drones-search-rescue-48981f2065f36600e426db9d441a894b",
												"https://apnews.com/article/bat-robots-drones-search-rescue-48981f2065f36600e426db9d441a894b",
											]}
											photoNumber={2}
											animationDelay={4}
											animationDuration={8}
											pendulumDuration={10}
										/>
										<FlippingPhoto
											images={["/drone.jpg", "/neck_movement.webp", "/throwing_ball.webp"]}
											links={[
												"https://pear.wpi.edu/research/saranga.html",
												"https://pear.wpi.edu/research/saranga.html",
												"https://pear.wpi.edu/research/saranga.html",
											]}
											photoNumber={3}
											animationDelay={6}
											animationDuration={10}
											pendulumDuration={8}
										/>
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
							<a
								href={INFO.socials.scholar}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faGoogleScholar}
									className="homepage-social-icon"
								/>
							</a>
							<a
								href={INFO.socials.orcid}
								target="_blank"
								rel="noreferrer"
							>
								<FontAwesomeIcon
									icon={faOrcid}
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

						{INFO.skills && INFO.skills.length > 0 && (
							<div className="homepage-skills">
								{INFO.skills.map((skill, index) => (
									<span
										className="homepage-skill"
										key={index}
									>
										{skill}
									</span>
								))}
							</div>
						)}

						<button
							className={
								"homepage-scroll-cue" +
								(scrolled ? " hidden" : "")
							}
							onClick={() =>
								document
									.querySelector(".homepage-projects")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							<span>See my research & projects</span>
							<FontAwesomeIcon
								icon={faChevronDown}
								className="homepage-scroll-cue-icon"
							/>
						</button>

						{INFO.homepage.featured && (
							<div className="homepage-featured">
								<div className="homepage-featured-label">
									{INFO.homepage.featured.label}
								</div>
								<div className="homepage-featured-video">
									<VideoPlayer
										src={INFO.homepage.featured.video}
										poster={INFO.homepage.featured.poster}
										label={INFO.homepage.featured.playerLabel}
										duration={INFO.homepage.featured.duration}
									/>
								</div>
								<div className="homepage-featured-caption">
									{INFO.homepage.featured.title}
								</div>
							</div>
						)}

						<div className="homepage-projects">
							<AllProjects variant="short" />
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
