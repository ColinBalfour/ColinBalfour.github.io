import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Media from "../components/common/media";
import Notfound from "./404";

import INFO from "../data/user";

import "./styles/readProject.css";

const ReadProject = () => {
	let { slug } = useParams();

	// Resolve by named slug; fall back to the legacy 1-based array index so
	// any older /projects/<number> links stay valid.
	const project =
		INFO.projects.find((p) => p.slug === slug) ||
		INFO.projects[Number(slug) - 1];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [project]);

	if (!project || !project.page) {
		return <Notfound />;
	}

	const page = project.page;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`${project.title} | ${INFO.main.title}`}</title>
				<meta name="description" content={project.description} />
				<meta name="keywords" content={project.keywords.join(", ")} />
			</Helmet>

			<div className="page-content">
				<NavBar />

				<div className="content-wrapper">
					<div className="read-project-logo-container">
						<div className="read-project-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="read-project-container">
						<div className="read-project-wrapper">
							<div className="read-project-date-container">
								<div className="read-project-date">
									{project.date}
								</div>
							</div>

							<div className="title read-project-title">
								<ReactMarkdown>{page.title}</ReactMarkdown>
							</div>

                            <div className="subtitle read-project-subtitle">
								<ReactMarkdown>{page.subtitle}</ReactMarkdown>
							</div>

							{page.links && page.links.length > 0 && (
								<div className="read-project-links">
									{page.links.map((l, i) => (
										<a
											key={i}
											className={
												"read-project-link-btn" +
												(l.primary ? " primary" : "")
											}
											href={l.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											{l.label}
										</a>
									))}
								</div>
							)}

							{page.video && (
								<div className="read-project-video">
									<iframe
										src={`https://www.youtube-nocookie.com/embed/${page.video}`}
										title={page.title}
										loading="lazy"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										allowFullScreen
									></iframe>
								</div>
							)}

							<div className="read-project-body">
								<ReactMarkdown
									components={{
										img: ({ src, alt }) => (
											<Media src={src} alt={alt || ""} />
										),
									}}
								>
									{page.description}
								</ReactMarkdown>
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

export default ReadProject;
