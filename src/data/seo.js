// Per-page SEO metadata. Each page component looks up its entry by `page`
// (SEO.find((item) => item.page === "...")) and feeds `description` / `keywords`
// into react-helmet. Keep descriptions distinct and under ~160 characters so
// search engines show them in full.
const SEO = [
	{
		page: "home",
		description:
			"Colin Balfour is a robotics software engineer focused on computer vision, perception, and autonomous quadrotors, with research at WPI's PeAR Lab. Explore projects in SLAM, control theory, and deep learning.",
		keywords: [
			"Colin Balfour",
			"robotics software engineer",
			"computer vision",
			"perception",
			"autonomous drones",
			"quadrotor",
			"SLAM",
			"control theory",
			"deep learning",
			"PeAR Lab",
			"WPI",
			"FIRST Robotics",
		],
	},

	{
		page: "about",
		description:
			"About Colin Balfour — a robotics engineering student at WPI researching perception and autonomous flight at the PeAR Lab, former FIRST Robotics team captain, and self-taught in control theory and mathematics.",
		keywords: [
			"Colin Balfour",
			"about",
			"robotics engineer",
			"WPI robotics",
			"PeAR Lab",
			"perception",
			"autonomous flight",
			"control theory",
			"FIRST Robotics",
			"Boston",
		],
	},

	{
		page: "robotics",
		description:
			"Colin Balfour's work on FIRST Robotics Team 3205 as captain and programming lead: command-based architecture, swerve drive, Kalman-filter localization, vision-based game-piece detection, and advanced autonomous routines.",
		keywords: [
			"Colin Balfour",
			"FIRST Robotics",
			"Team 3205",
			"swerve drive",
			"command-based",
			"WPILib",
			"Kalman filter",
			"robot programming",
			"autonomous",
			"motion planning",
		],
	},

	{
		page: "projects",
		description:
			"A collection of Colin Balfour's robotics and computer-vision projects: drone obstacle avoidance, monocular SLAM and NeRF, structure from motion, image segmentation, and deep-learning classifiers. Many are open source.",
		keywords: [
			"Colin Balfour",
			"projects",
			"computer vision",
			"SLAM",
			"NeRF",
			"structure from motion",
			"drone obstacle avoidance",
			"image segmentation",
			"deep learning",
			"PyTorch",
			"OpenCV",
		],
	},

	{
		page: "publications",
		description:
			"Peer-reviewed and in-review research by Colin Balfour on perception and autonomous flight, including Saranga (Science Robotics), AttentionSeeker (RA-L), and ActiveNav (ICRA).",
		keywords: [
			"Colin Balfour",
			"publications",
			"research",
			"Science Robotics",
			"Saranga",
			"AttentionSeeker",
			"ActiveNav",
			"aerial robotics",
			"drone navigation",
			"PeAR Lab",
		],
	},

	{
		page: "playground",
		description:
			"Interactive robotics demos running in your browser: a live event-camera (DVS) simulator, and a quadrotor that learns to fly from scratch via PPO — policy gradients, GAE and domain randomization, implemented in plain JavaScript.",
		keywords: [
			"Colin Balfour",
			"playground",
			"reinforcement learning",
			"PPO",
			"proximal policy optimization",
			"GAE",
			"domain randomization",
			"sim2real",
			"event camera",
			"DVS",
			"interactive demo",
			"robotics",
			"quadrotor",
		],
	},

	{
		page: "contact",
		description:
			"Get in touch with Colin Balfour — open to robotics and software collaboration, research, and new opportunities. Reach out by email or connect on GitHub and LinkedIn.",
		keywords: [
			"Colin Balfour",
			"contact",
			"robotics collaboration",
			"email",
			"GitHub",
			"LinkedIn",
			"hire",
			"research",
		],
	},
];

export default SEO;
