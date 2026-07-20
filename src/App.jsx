import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Homepage from "./pages/homepage";
import About from "./pages/about";
import Robotics from "./pages/robotics";
import Projects from "./pages/projects";
import ReadProject from "./pages/readProject";
import Publications from "./pages/publications";
import Learning from "./pages/learning";
import Contact from "./pages/contact";
import Notfound from "./pages/404";

import { TRACKING_ID } from "./data/tracking";
import "./app.css";

function App() {
	useEffect(() => {
		if (TRACKING_ID !== "") {
			ReactGA.initialize(TRACKING_ID);
		}
	}, []);

	return (
		<div className="App">
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/about" element={<About />} />
					<Route path="/robotics" element={<Robotics />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/projects/:slug" element={<ReadProject />} />
					<Route path="/publications" element={<Publications />} />
					<Route path="/learning" element={<Learning />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/*" element={<Notfound />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
		</div>
	);
}

export default App;
