import React, { useRef, useEffect } from "react";

// Renders an .mp4/.webm source as a muted, looping, GPU-decoded <video>
// (played only while on-screen via IntersectionObserver), and anything else
// as a lazy <img>. Lets project media stay fast to decode without autoplaying
// every clip on a page at once.
const isVideo = (src) => /\.(mp4|webm)(\?|#|$)/i.test(src || "");

const Media = ({ src, alt = "", className }) => {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") return;

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const p = el.play();
						if (p && p.catch) p.catch(() => {});
					} else {
						el.pause();
					}
				});
			},
			{ threshold: 0.15 }
		);
		io.observe(el);
		return () => io.disconnect();
	}, [src]);

	if (isVideo(src)) {
		return (
			<video
				ref={ref}
				className={className}
				muted
				loop
				playsInline
				preload="metadata"
				aria-label={alt}
			>
				<source
					src={src}
					type={
						/\.webm(\?|#|$)/i.test(src)
							? "video/webm"
							: "video/mp4"
					}
				/>
			</video>
		);
	}

	return (
		<img src={src} alt={alt} className={className} loading="lazy" />
	);
};

export default Media;
