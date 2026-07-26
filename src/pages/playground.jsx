import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import EventCamera from "../components/playground/eventCamera";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/playground.css";

const Playground = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "playground");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Playground | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="playground" />
				<div className="content-wrapper">
					<div className="playground-logo-container">
						<div className="playground-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="playground-container">
						<div className="title playground-title">
							Playground
						</div>

						<div className="subtitle playground-subtitle">
							Interactive demos of the ideas behind my research —
							running entirely in your browser.
						</div>

						<div className="playground-demo">
							<div className="playground-demo-header">
								<div className="playground-demo-label">
									Demo 01
								</div>
								<h2 className="playground-demo-title">
									Event Camera Simulator
								</h2>
								<p className="playground-demo-intro">
									A conventional camera sends you whole frames
									on a clock. An <strong>event camera</strong>{" "}
									does something stranger: every pixel acts on
									its own, staying silent until the{" "}
									<em>log</em> of the light hitting it shifts
									by more than a contrast threshold — then it
									fires a single event saying "brighter here,
									now" or "darker here, now." Nothing moves,
									nothing is reported.
								</p>
								<p className="playground-demo-intro">
									The result is a sensor with microsecond
									latency, enormous dynamic range, and almost
									no redundant data — which is exactly why I
									use them to fly drones through cluttered
									forests in{" "}
									<Link to="/publications">
										AttentionSeeker
									</Link>{" "}
									and my{" "}
									<Link to="/projects/agile-event-flight">
										MQP
									</Link>
									. This page runs that same per-pixel state
									machine on your webcam. Wave a hand and
									you'll see only the edges that moved.
								</p>
							</div>

							<EventCamera />

							<div className="playground-notes">
								<div className="playground-note">
									<div className="playground-note-title">
										What you're looking at
									</div>
									<p>
										Green marks pixels that got brighter,
										red marks pixels that got darker. Static
										background produces nothing at all — a
										real event camera would be sending zero
										data for those pixels, which is where
										its speed and efficiency come from.
									</p>
								</div>
								<div className="playground-note">
									<div className="playground-note-title">
										Try this
									</div>
									<p>
										Hold still and watch the frame empty
										out. Then drop the contrast threshold
										and see sensor noise creep in — the same
										tradeoff between sensitivity and false
										events that has to be tuned on real
										hardware.
									</p>
								</div>
								<div className="playground-note">
									<div className="playground-note-title">
										Privacy
									</div>
									<p>
										Everything is computed locally on a
										canvas in your browser. No frame is
										uploaded, recorded, or sent anywhere.
									</p>
								</div>
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

export default Playground;
