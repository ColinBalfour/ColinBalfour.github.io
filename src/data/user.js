import PROJECTS from "./projects.js";

const INFO = {
	main: {
		title: "Colin Balfour's Portfolio",
		name: "Colin Balfour",
		email: "colinbalfour@gmail.com",
		logo: "/logo.png",
	},

	socials: {
		// twitter: "https://twitter.com/",
		github: "https://github.com/ColinBalfour",
		linkedin: "https://www.linkedin.com/in/colin-d-balfour/",
		scholar: "https://scholar.google.com/citations?user=j4OPF1YAAAAJ&hl=en",
		orcid: "https://orcid.org/0009-0009-5809-5165",
		// instagram: "https://instagram.com/",
		// stackoverflow: "https://stackoverflow.com/",
		// facebook: "https://facebook.com/",
	},

	skills: [
		"Python",
		"C / C++",
		"ROS 2",
		"PyTorch",
		"CUDA",
		"Isaac Sim",
		"OpenCV",
		"Reinforcement Learning",
		"Computer Vision",
		"Docker",
		"Jetson",
		"TensorFlow",
	],

	homepage: {
		status: "Robotics Software Intern @ NVIDIA",
		featured: {
			video: "/research_clips.mp4",
			poster: "/research_clips_poster.jpg",
			label: "Research Highlights",
			playerLabel: "Saranga · UFlowRL · MQP",
			duration: "0:34",
			title: "A reel from my research: ultrasound navigation through darkness and fog (Saranga), active monocular flight through forests (UFlowRL), and agile event-based flight through an obstacle course (my MQP).",
		},
		title: "Robotics software engineer and researcher in perception & autonomy.",
		description:
			"I'm Colin Balfour, a robotics engineer and deep-learning researcher focused on perception and autonomous flight. I'm currently building simulation tooling for robot learning at NVIDIA (Isaac Sim), and I research reinforcement learning for high-speed drone navigation at WPI's PeAR Lab — where my work on ultrasound-based navigation in visually degraded environments was published in Science Robotics. I've built palm-sized drones that fly autonomously in complete darkness, smoke, and snow, optimized vision models on embedded TPUs and GPUs, and written custom CUDA kernels for real-time depth rendering. I care about robust systems, elegant code, and pushing what small autonomous robots can do.",
	},

	about: {
		title: "I’m Colin Balfour, a robotics engineer and researcher in the Boston area, teaching machines to perceive and fly.",
		description:
			"I'm pursuing my B.S. and M.S. in Robotics Engineering at WPI, with a minor in mathematics. My work spans deep learning, perception, and autonomous systems — from research and engineering internships at NVIDIA, Magna Electronics, and RTX BBN to published research at the PeAR Lab. Much of my project work is open-source; if something here catches your eye, feel free to explore the code, reach out, or share ideas. I'm always open to new challenges and collaboration.",
	},

	robotics: {
		title: "My role on [FIRST Robotics](https://www.firstinspires.org/robotics/frc) Team 3205",
		subtitle: "I hope to pursue a career in robotics, so my FIRST robotics team is the best way I can get involved in that now. Below I provide some information and visuals on what I've accomplished and what I hope to do this year.",
		sections: [
			{
				header: "The Future: 2023-2024 Season (Team Captain & Programming Lead)",
			description: "As team captain and programming lead, I have big goals for this year. We recently transitioned to a new head mentor after our previous retired from teaching, and I’ve used this opportunity along with our growing team size (50 students this year!) to take our team to the next level, with the **goal of making it to the World Championships** (hasn’t been done by our team in over 10 years). On the technical side, this means: ",
			bullet: [
				"Creating a preseason training program that **engages students and gives them hands-on expertise** (includes developing a large + adaptable set of exercises and resources on GitHub)",
				"Redesigning the code-base to use a **“command-based” structure** (everything is grouped into subsystems, reducing potential bugs/conflicts)",
				"Setting up a logging framework to **keep track of every input and output to the robot** enabling improved replay/simulation",
				"Using an array of cameras to provide **accurate estimates of the robot’s position** combined with tracking wheel rotations using statistical filters (Kalman filter)",
				"Object detection for **autonomous game-piece manipulation**",
				"Purchasing (and doing the prerequisite research) a new sensor and coprocessor array to support these projects",
				"Smoother motion using more advanced control techniques",
				"**Advanced autonomous routines** (moving along a spline)",
				"A new drivetrain – **“Swerve Drive”**, uses swiveling wheels like a shopping cart to be able to **move in any direction precisely and smoothly**",
				"And many other smaller projects"
				]
			},
			{
				header: "",
				description: "Unfortunately, I can’t do this all on my own and nearly all our software members are underclassmen without much experience. I hope to not only accomplish all of what I mentioned, but also train the newer members to be able to do it themselves (and in most cases they will be doing it themselves, with me guiding). On the non-technical side, this includes:",
				bullet: [
					"Setting up the team as an official independent **501(c)(3)**",
					"Reaching out to companies for potential **sponsorships**",
					"Creating **fundraisers** to enable new projects",
					"Creating a **brand-identity** to make our team more marketable to companies and known by our local community",
					"Getting more **involved with the local community** (mentoring middle school robotics team)",
					"Getting more **involved with the FIRST robotics community** (becoming an “open alliance” member – posting weekly updates and writing whitepapers on successful projects",
					"**Organizing the team like a business** – creating specific roles, processes for large changes to the robot, **formal design processes, design reviews**, and more",
					"Setting up and communicating with a formal parent-group to help coordinate events and handle financial/logistical/legal challenges"
				]
			},
			{
				header: "",
				description: "In order to accomplish all this, I have to effectively **delegate and manage** the many members of the team and **stay organized and in contact** with how everyone’s projects are going, both on the technical and non-technical side. Due to this, I have to spend an enormous amount of time on robotics, and **I am fully committed to the team**. In addition, I spend a few hours every weekend reading through FIRST robotics forum pages where people ask questions and post information, both **helping out other teams and learning about challenges that they face** – better preparing myself and my team by being aware of and getting ahead of the problems we may encounter.",
				bullet: []
			},
			{
				header: "The Past: 2022-2023 Season (Programming Lead)",
				description: "",
				bullet: [
					"Trained new members to use machine learning, perception and SLAM algorithms",
					"Utilized a ZED Stereo depth camera and an NVIDIA Jetson for pose estimation by combining April Tag localization, VSLAM, and motor encoders in a Kalman filter, and real-time object detection with MobileNet-v2",
					"Used an IMU to stabilize robot heading and implement an absolute-oriented drive",
					"Developed a PID + FF controller for two jointed arm using IK and for autonomous balancing routine",
					"Created time-parameterized 2D motion profile with velocity and acceleration constraints for two jointed arm",
					"Implemented a distance sensor on end effector to automate pickup",
					"Set up communication from an Arduino to our controller over SPI to make cool rgb lights to represent states",
					"Team placed 6th at the New England Championships, as an Alliance Captain (best in our ‘alliance’ of 3 teams)"
				]
			},
			{
				header: "The Past: 2021-2022 Season",
				description: "",
				bullet: [
					"Controlled linear actuators using Arduino, using an oscilloscope to debug PWM wave outputs",
					"Helped design and build our mecanum holonomic drive-base for the 2022 season",
					"Utilized python with opencv to create an image recognition program to detect balls and robots on the field "
				]
			}
		]
	},

	publications: [
		{
			title: "Saranga: milliWatt Ultrasound for Navigation in Visually Degraded Environments on Palm-Sized Aerial Robots",
			authors: "M. Velmurugan, P. Brush, Colin Balfour, R. Przybyla, N. Sanket",
			venue: "Science Robotics",
			year: "2026",
			status: "Published",
			image: "/saranga.jpg",
			blurb:
				"A bat-inspired, low-power ultrasound perception stack that lets a 140g drone localize obstacles and fly through fog, snow, and total darkness using only onboard sensing — pairing physical propeller-noise suppression with a deep denoising network trained on synthetic data.",
			links: [
				{
					label: "Paper",
					url: "https://www.science.org/doi/10.1126/scirobotics.adz9609",
				},
				{ label: "arXiv", url: "https://arxiv.org/abs/2603.24699" },
				{ label: "Code", url: "https://github.com/pearwpi/Saranga" },
			],
		},
		{
			title: "AttentionSeeker: Using Defocus in Events for Passive Attention-Based Aerial Navigation",
			authors: "Colin Balfour*, D. Singh*, N. Sanket",
			venue: "IEEE Robotics and Automation Letters (RA-L)",
			year: "2026",
			status: "Under Review",
			note: "* Equal contribution",
			image: "/Events_Video.mp4",
			blurb:
				"Passive, attention-based aerial navigation that reads defocus cues in event-camera streams, training reinforcement-learning policies to fly through dense forest at high speed using only events.",
		},
		{
			title: "UFlowRL: Learning Monocular Flight with Optical Flow and Uncertainty",
			authors: "Colin Balfour, K. Srivastava, D. Singh, N. Sanket",
			venue: "IEEE International Conference on Robotics and Automation (ICRA)",
			year: "2027",
			status: "Under Review",
			image: "/activenav.jpg",
			blurb:
				"A hierarchical reinforcement-learning policy that actively steers a quadrotor's camera along with its motion — pointing it to reduce perception uncertainty — for zero-shot sim-to-real flight through cluttered, unseen forests.",
		},
	],

	press: [
		{
			title: "How tiny drones inspired by bats could save lives in dark and stormy conditions",
			outlet: "Associated Press",
			date: "October 2025",
			url: "https://apnews.com/article/bat-robots-drones-search-rescue-48981f2065f36600e426db9d441a894b",
			summary:
				"The AP visited the PeAR Lab to cover our bat-inspired, palm-sized drones that navigate darkness, smoke, and fog using ultrasound — including photos of me flying one at WPI.",
		},
		{
			title: "Bats master the dark with sound. WPI engineers hope their drones do the same in dangerous situations.",
			outlet: "CBS News Boston",
			date: "April 2026",
			url: "https://www.cbsnews.com/boston/news/bats-drones-wpi-engineers/",
			summary:
				"A televised segment on the lab's ultrasound navigation work, including my walkthrough of the 1.2 milliwatt sensor.",
		},
		{
			title: "Bats Inspire Advance in Aerial Robots",
			outlet: "WPI News",
			date: "March 2026",
			url: "https://www.wpi.edu/news/bats-inspire-advance-aerial-robots",
			summary:
				"WPI's feature on the Science Robotics paper behind Saranga.",
		},
		{
			title: "WPI's Bat-Inspired Drones Could Transform Search and Rescue",
			outlet: "DroneLife",
			date: "October 2025",
			url: "https://dronelife.com/2025/10/31/how-tiny-bat-inspired-drones-could-transform-search-and-rescue-operations/",
			summary:
				"How the ultrasound-based perception stack could support search-and-rescue operations.",
		},
	],

	// Project cards + pages live in projects.js — edit them with `npm run edit`.
	projects: PROJECTS.filter((p) => !p.hidden),

	learning: {
		title: "My (Independent) Learning",
		subtitle: "Since middle school I've spent countless hours every day learning; it began by simply using khanacademy to learn some extra algebra, but now I attribute almost all my technical knowledge to self-studying. Below are a list of the more recent/notable topics I've learned about (including a few university courses):",
		description:
			"",
		keywords: [
			"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
		],
	},

	work: [
		{
			id: 0,
			src: "./nvidia_logo.svg",
			alt: "NVIDIA",
			wide: true,
			title: "NVIDIA",
			subtitle: "Robotics Software Intern — Isaac Sim",
			duration: "May 2026 - Present",
		},
		{
			id: 1,
			src: "./pear_logo.png",
			alt: "PeAR",
			title: "Perception and Autonomous Robotics (PeAR) Group",
			subtitle: "Perception & Deep Learning Researcher",
			duration: "May 2024 - Present",
		},
		{
			id: 2,
			src: "./magna_logo.svg",
			alt: "Magna Electronics",
			wide: true,
			title: "Magna Electronics",
			subtitle: "Machine Learning Intern — ADAS Perception",
			duration: "Jan 2026 - May 2026",
		},
		{
			id: 3,
			src: "./bbn_logo.png",
			alt: "RTX BBN Technologies",
			title: "RTX BBN Technologies",
			subtitle: "Research Intern — Physical Sciences & Systems",
			duration: "May 2025 - Dec 2025",
		},
		{
			id: 4,
			src: "./3205_logo.jpg",
			alt: "3205",
			title: "FIRST Robotics Team 3205",
			subtitle: "Team Captain & Software Lead",
			duration: "2021 - 2024",
		},
		{
			id: 5,
			src: "./sakon_fav.ico",
			alt: "sakon",
			title: "Sakon",
			subtitle: "Implementation & Data Analytics Intern",
			duration: "2021 - 2022",
		},
	],

	education: [
		{
			id: 0,
			src: "./WPI_logo.png",
			alt: "WPI",
			title: "Worcester Polytechnic Institute (WPI)",
			subtitle: "M.S. Robotics Engineering (May 2027)\nB.S. Robotics Engineering, Minor in Mathematics (May 2027)",
			duration: "2024 - Present",
		},
		{
			id: 1,
			src: "./cchs_logo.png",
			alt: "CCHS",
			title: "Concord Carlisle High School (CCHS)",
			subtitle: "High School Diploma, Engineering Certificate",
			duration: "2020 - 2024",
		},
	],

	// Individual university courses taken alongside the degrees above —
	// rendered as a separate "Supplemental Coursework" card.
	supplementalEducation: [
		{
			id: 0,
			src: "./neu_logo.png",
			alt: "NEU",
			title: "Northeastern University",
			subtitle: "Advanced Group Theory",
			duration: "Fall 2023",
		},
		{
			id: 1,
			src: "./uml_logo.png",
			alt: "UML",
			title: "University of Massachusetts - Lowell",
			subtitle: "Computational Mathematics (Graduate)",
			duration: "Spring 2023",
		},
		{
			id: 2,
			src: "./harvard_logo.png",
			alt: "Harvard",
			title: "Harvard University",
			subtitle: "Linear Algebra, Vector Calculus, Real Analysis, and Probability Theory/Statistics",
			duration: "Fall 2022, Spring 2023",
		},
	],
};

export default INFO;
