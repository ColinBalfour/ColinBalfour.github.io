import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import EventCamera from "../components/playground/eventCamera";
import RLLab from "../components/playground/rlLab";

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

						<div className="playground-demo">
							<div className="playground-demo-header">
								<div className="playground-demo-label">
									Demo 02
								</div>
								<h2 className="playground-demo-title">
									Learning to Fly — PPO, from scratch, live
								</h2>
								<p className="playground-demo-intro">
									This quadrotor starts knowing nothing. Press{" "}
									<strong>Train</strong> and a{" "}
									<strong>Proximal Policy Optimization</strong>{" "}
									agent learns to fly it in about a minute —
									policy gradient, GAE(λ) advantages, clipped
									surrogate objective and all, implemented in
									plain JavaScript with hand-written backprop.
									No ML framework, no pre-trained weights,
									nothing downloaded: the training loop runs in
									a Web Worker on your machine.
								</p>
								<p className="playground-demo-intro">
									The interesting part isn't that it converges
									— it's the panel on the right. Those are the
									diagnostics you actually read when an RL run
									misbehaves, and the sliders let you break the
									run on purpose to see each one react.
								</p>
							</div>

							<RLLab />

							<div className="playground-notes">
								<div className="playground-note">
									<div className="playground-note-title">
										Try: break the trust region
									</div>
									<p>
										Push the learning rate to 1e-2 and watch{" "}
										<strong>approx-KL</strong> spike and{" "}
										<strong>clip fraction</strong> saturate:
										the update is landing far outside the
										region the surrogate is valid in, and
										return collapses. That is what PPO's
										clipping exists to prevent.
									</p>
								</div>
								<div className="playground-note">
									<div className="playground-note-title">
										Try: kill exploration
									</div>
									<p>
										Set the entropy coefficient to 0 early
										on. Entropy decays fast, the policy
										commits to whatever it found first, and
										it often plateaus in a local optimum —
										hovering safely off to one side rather
										than finding the goal.
									</p>
								</div>
								<div className="playground-note">
									<div className="playground-note-title">
										Try: the sim2real gap
									</div>
									<p>
										Train to convergence, then shove the
										robot with your cursor. A policy trained
										on the nominal model gets knocked over by
										a disturbance it never saw. Re-train with{" "}
										<strong>domain randomization</strong> —
										randomized mass, thrust, wind, actuator
										latency and sensor noise — and it rejects
										the same gust. Zero-shot robustness,
										bought at training time.
									</p>
								</div>
							</div>

							<div className="playground-methods">
								<div className="playground-methods-title">
									What's actually running
								</div>
								<p>
									The agent maximises the clipped surrogate,
									where{" "}
									<code>
										r<sub>t</sub>(θ) = π<sub>θ</sub>(a|s) /
										π<sub>θold</sub>(a|s)
									</code>
									:
								</p>
								<pre>
{`L(θ) = E[ min( r·A , clip(r, 1-ε, 1+ε)·A ) ]  -  c_v·(V - V_target)²  +  c_H·H[π]`}
								</pre>
								<p>
									Advantages come from GAE(λ), which trades
									bias against variance:
								</p>
								<pre>
{`δ_t = r_t + γ·V(s_t+1) - V(s_t)
A_t = Σ (γλ)^l · δ_(t+l)`}
								</pre>
								<p>
									A few details that matter more than they
									look: advantages are normalized per batch;
									gradients are clipped by global norm; the
									epoch loop stops early if approx-KL
									overshoots its target; and the value function
									bootstraps through a time-limit but{" "}
									<em>not</em> through a crash — conflating
									those two teaches the agent that running out
									of clock is as bad as falling out of the sky.
								</p>
								<p className="playground-methods-links">
									Source, with unit tests including a
									finite-difference gradient check:{" "}
									<a
										href="https://github.com/ColinBalfour/ColinBalfour.github.io/blob/main/src/utils/rl/ppo.js"
										target="_blank"
										rel="noopener noreferrer"
									>
										ppo.js
									</a>
									{" · "}
									<a
										href="https://github.com/ColinBalfour/ColinBalfour.github.io/blob/main/src/utils/rl/nn.js"
										target="_blank"
										rel="noopener noreferrer"
									>
										nn.js
									</a>
									{" · "}
									<a
										href="https://github.com/ColinBalfour/ColinBalfour.github.io/blob/main/src/utils/rl/env.js"
										target="_blank"
										rel="noopener noreferrer"
									>
										env.js
									</a>
									{" · "}
									<a
										href="https://github.com/ColinBalfour/ColinBalfour.github.io/blob/main/src/utils/rl/trainer.js"
										target="_blank"
										rel="noopener noreferrer"
									>
										trainer.js
									</a>
								</p>
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
