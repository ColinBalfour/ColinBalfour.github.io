import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import "./styles/videoPlayer.css";

// Self-hosted video with a poster + custom play overlay; native controls
// appear only once playback starts.
const VideoPlayer = ({ src, poster, label, duration }) => {
	const videoRef = useRef(null);
	const [started, setStarted] = useState(false);

	const start = () => {
		setStarted(true);
		// play() after state flip so the controls attribute is already set
		requestAnimationFrame(() => videoRef.current && videoRef.current.play());
	};

	return (
		<div
			className={"video-player" + (started ? " playing" : "")}
			onClick={!started ? start : undefined}
		>
			<video
				ref={videoRef}
				controls={started}
				preload="none"
				poster={poster}
				playsInline
			>
				<source src={src} type="video/mp4" />
			</video>

			{!started && (
				<div className="video-player-overlay">
					<div className="video-player-scrim"></div>
					<button
						className="video-player-play"
						aria-label="Play video"
					>
						<FontAwesomeIcon icon={faPlay} />
					</button>
					{label && (
						<div className="video-player-label">{label}</div>
					)}
					{duration && (
						<div className="video-player-duration">{duration}</div>
					)}
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
