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
			playerLabel: "Saranga · ActiveNav · MQP",
			duration: "0:34",
			title: "A reel from my research: ultrasound navigation through darkness and fog (Saranga), active monocular flight through forests (ActiveNav), and agile event-based flight through an obstacle course (my MQP).",
		},
		title: "Robotics software engineer and researcher in perception & autonomy.",
		description:
			"I'm Colin Balfour, a robotics engineer and deep-learning researcher focused on perception and autonomous flight. I'm currently building simulation tooling for robot learning at NVIDIA (Isaac Sim), and I research reinforcement learning for high-speed drone navigation at WPI's PeAR Lab — where my work on ultrasound-based navigation in visually degraded environments was published in Science Robotics. I've built palm-sized drones that fly autonomously in complete darkness, smoke, and snow, optimized vision models on embedded TPUs and GPUs, and written custom CUDA kernels for real-time depth rendering. I care about robust systems, elegant code, and pushing what small autonomous robots can do.",
	},

	about: {
		title: "I’m Colin Balfour — a robotics engineer and researcher in the Boston area, teaching machines to perceive and fly.",
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
			title: "ActiveNav: Learning Active Monocular Flight in Forests",
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

	projects: [
		{
			title: "[Science Robotics 2026] Saranga: milliWatt Ultrasound Navigation on Palm-Sized Drones",
			tagline:
				"Autonomous flight through darkness, smoke, and snow on a 140g drone — milliwatt ultrasound + learned denoising. Science Robotics 2026.",
			description:
				"Saranga is the first palm-sized aerial robot capable of autonomous navigation in complete darkness, smoke, and snow — using only onboard milliWatt ultrasound sensing and compute, at just 140g. " +
				"I employ deep-learning signal processing to suppress noise and estimate depth in real time, achieving 84% success across 10 scenes (200+ trials). " +
				"Published in Science Robotics (2026).",
			photo: "/saranga.jpg",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://pear.wpi.edu/research/saranga.html",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics",
			],
		},

		{
			title: "[Under Review — ICRA 2027] ActiveNav: Learning Active Monocular Flight in Forests",
			tagline:
				"Hierarchical RL that aims the camera mid-flight — 80% success in unseen forests, zero-shot sim2real on a Jetson.",
			description:
				"ActiveNav is a novel approach for quadrotor navigation using active perception. " +
				"With flow and its uncertainty as an input, a hierarchical RL policy actively " +
				"controls the drone's camera along with its movement. The policy is able to actively point the camera to areas " +
				"that would improve perception and avoid obstacles. The model was able to generalize zero-shot to the real world, " +
				"running onboard a Jetson Nano.",
			photo: "/activenav.jpg",
			logo: [
				"/pytorch_logo.png",
				"/blender_logo.png",
				"/opencv_logo.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			slug: "activenav",
			link: "/projects/",
			keywords: [
				"Colin Balfour", "Balfour", "ActiveNav", "Active Perception", "Reinforcement Learning", "Drone", "Quadrotor", "Monocular", "Optical Flow", "Robotics", "ICRA",
			],
			page: {
				title: "ActiveNav: Learning Active Monocular Flight in Forests",
				subtitle:
					"Under review at **ICRA 2027** (with K. Srivastava, D. Singh, and N. Sanket, PeAR Lab). A hierarchical RL policy that actively points the drone's camera — not just its body — to see better and fly further.",
				description:
					"Most drones treat their camera as a fixed sensor bolted to the airframe: wherever the body points, that's what they see. ActiveNav borrows a trick from birds — which constantly move their heads to gather the most useful visual information — and learns to control the camera's gaze *as part of the flight policy itself*.\n\n" +
					"## How it works\n\n" +
					"The policy takes optical flow and its uncertainty as input, and a **hierarchical reinforcement-learning** controller outputs both flight commands and an active camera (neck) yaw. The camera is steered toward regions that reduce perception uncertainty — peeking around occlusions and checking gaps before committing — which directly improves obstacle avoidance in dense clutter.\n\n" +
					"![ActiveNav forest flight](/speedmeter_web.mp4)\n\n" +
					"## Results\n\n" +
					"Trained entirely in simulation, the policy transfers **zero-shot** to the real world, achieving 80% success in cluttered, previously unseen forest environments — running fully onboard a Jetson Nano.\n\n" +
					"![Onboard view](/activenav.jpg)",
			},
		},

		{
			title: "[Under Review — RA-L 2026] AttentionSeeker: Passive Attention-Based Aerial Navigation with Events",
			tagline:
				"Passive attention from defocus in event streams — high-speed forest flight with no frames and no depth sensor.",
			description:
				"AttentionSeeker uses defocus cues in event-camera streams for passive, attention-based aerial navigation. " +
				"I train reinforcement-learning policies that fly a drone through dense forest at high speed using only events — the GIF above shows one such policy in simulation.",
			photo: "/Events_Video.mp4",
			slug: "attentionseeker",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/numpy.svg",
				"/cuda.svg",
				"/blender_logo.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png",
			],
			linkText: "View Project",
			link: "/projects/",
			keywords: [
				"Colin Balfour", "Balfour", "AttentionSeeker", "Event Camera", "Defocus", "Attention", "Reinforcement Learning", "Drone", "Aerial Navigation", "RA-L", "Robotics",
			],
			page: {
				title: "AttentionSeeker: Using Defocus in Events for Passive Attention-Based Aerial Navigation",
				subtitle:
					"Under review at **RA-L 2026** (with D. Singh* and N. Sanket, PeAR Lab; *equal contribution). Passive attention for drones: letting the optics themselves say what matters.",
				description:
					"Event cameras only report *change* — asynchronous, per-pixel brightness events at microsecond latency, with no frames at all. That makes them ideal for fast flight, but it also means most of the stream is clutter: everything moves when the camera does. AttentionSeeker asks a simple question — what if the lens itself could tell us what to pay attention to?\n\n" +
					"## Defocus as attention\n\n" +
					"By exploiting **defocus cues** in the event stream, objects at the depth of interest produce sharp, distinctive event signatures while the rest blurs away — a *passive*, optics-driven attention mechanism that requires no extra compute, power, or moving parts. The result is a naturally foveated input that highlights obstacles at exactly the range that matters for avoidance.\n\n" +
					"![Event stream visualization](/Events_Video.mp4)\n\n" +
					"## Learning to fly on events\n\n" +
					"On top of this attention signal we train **reinforcement-learning policies** that fly a quadrotor through dense forest at high speed using only events — no frames, no depth sensor. The GIF above shows a policy navigating a dense simulated forest from the event stream alone.",
			},
		},

		{
			title: "Agile Event-based Flight through Cluttered Environments",
			tagline:
				"Event-camera depth + topological replanning on a custom-built quadrotor, fully onboard. Best MQP Award Finalist.",
			description:
				"My WPI senior capstone (MQP), and a Best MQP Award Finalist: a full event-camera perception, planning, and control stack that flies a custom-built quadrotor through dense, cluttered environments using only onboard sensing — inspired by how birds fly through trees.",
			date: "2025 - 2026",
			logo: [
				"/pytorch_logo.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
				"/ros2_logo.png",
				"/opencv_logo.png",
				"/cuda.svg",
			],
			linkText: "View Project",
			slug: "agile-event-flight",
			link: "/projects/",
			photo: "/mqp_flight.mp4",
			keywords: [
				"Colin Balfour", "Balfour", "MQP", "WPI", "Event Camera", "Drone", "Quadrotor", "Autonomous Navigation", "Motion Planning", "Deep Learning", "Reinforcement Learning", "Robotics",
			],
			page: {
				title: "Agile Event-based Flight through Cluttered Environments",
				subtitle:
					"My WPI Major Qualifying Project (senior capstone) — a **Best MQP Award Finalist**. Built with Rohan Inamdar and Evan Kaba, advised by Guanrui Li and Nitin Sanket (ACP Lab & PeAR Lab).",
				links: [
					{
						label: "📄 Read the Project Report",
						url: "https://drive.google.com/file/d/1a4dQrtl8_N-TtYmtHigq0v0pnoG3NXzc/view",
						primary: true,
					},
					{
						label: "▶ Skip to the Flight Tests",
						url: "https://youtu.be/vZI_f9TqJVw?t=155",
					},
				],
				video: "vZI_f9TqJVw",
				description:
					"Birds fly through dense forests at high speed with nothing but their eyes. Our MQP asked whether a palm-sized quadrotor could do the same — navigating hazardous, cluttered, and dynamic environments using only lightweight **event-camera** perception and onboard compute, instead of the bulky LIDAR or stereo rigs that agile drones usually rely on. We built the full stack end to end: perception, planning, control, and the aircraft itself.\n\n" +
					"## Event-based depth perception\n\n" +
					"Event cameras report asynchronous, per-pixel brightness changes at microsecond latency — ideal for fast flight, but their sparse, unconventional data breaks standard vision pipelines. We treat the event stream as a 3D point cloud and learn to predict dense depth from it, using a multi-resolution feature grid (L = 4 levels) with trilinear interpolation and a Deep Sets–style spatial pooling that turns sparse events into a dense feature map for the network to reason over.\n\n" +
					"## Planning: topological replanning\n\n" +
					"From the predicted depth we build an occupancy ESDF and plan with a Fast-Planner–style topological search. A sparse roadmap of “guards” defines free-space regions, connectors link distinct passages, and each distinct route is shortened, pruned, and optimized into a smooth, dynamically feasible B-spline. When visibility changes mid-flight, the planner replans in real time rather than re-searching from scratch.\n\n" +
					"![Topological replanning](/mqp_planner.jpg)\n\n" +
					"## The aircraft\n\n" +
					"To carry the event camera and onboard compute, we designed and built a custom carbon-fiber quadrotor, iterating from CAD to a flight-ready platform tuned for agile flight.\n\n" +
					"![Custom quadrotor](/mqp_drone.jpg)\n\n" +
					"## Results\n\n" +
					"The system flew autonomously through dense, cluttered obstacle courses using only onboard sensing and computation — below, the drone (bottom right) threads the arena while the onboard point cloud builds in real time (inset). The project was recognized as a Best MQP Award Finalist at WPI.\n\n" +
					"![Autonomous arena flight](/mqp_flight.mp4)",
			},
		},

		{
			title: "Einstein Vision: a Full-Self Driving Perception Stack",
			tagline:
				"3D object tracking, lanes, depth, and collision prediction — a full AV perception stack from one camera.",
			description:
				"FSD perception stack for a self-driving car, using a variety of models with only a single camera. " +
				"Pre-trained models were used for object detection, depth estimation, optical flow, and instance segmentation. " +
				"Objects are tracked in 3D, along with collision prediction, motion detection, and lane detection. ",

			photo: "/einstein-vision.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/blender_logo.png",
				"/opencv_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Einstein-Vision",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Computer Vision", "Self Driving", "Autonomous Car", "AI", "Deep Learning", 
			],
		},

		{
			title: "Event Camera Simulator (Live Demo)",
			tagline:
				"A DVS sensor model running live on your webcam — per-pixel log-intensity events, entirely client-side.",
			description:
				"An interactive browser demo that turns your webcam into an event camera. Every pixel independently tracks the log of incoming brightness and fires an ON/OFF event only when it crosses a contrast threshold, advancing its own reference one step at a time — so static scenery produces nothing at all, exactly like real DVS hardware. Written in plain JavaScript on a canvas with tunable threshold and event persistence; no frame ever leaves the browser.",
			date: "2026",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
			],
			linkText: "Try the demo",
			link: "/playground",
			photo: "/playground_events.mp4",
			keywords: [
				"Colin Balfour", "event camera", "DVS", "dynamic vision sensor", "interactive demo", "computer vision", "JavaScript", "canvas", "simulation", "robotics",
			],
		},

		{
			title: "Classical Structure From Motion (SfM) & Neural Radiance Field (NeRF)",
			tagline:
				"Full classical SfM pipeline + a NeRF implemented from scratch in PyTorch.",
			description:
				"Reconstructing a scene, both classically and with deep learning. Developed a omplete classical Structure-from-Motion pipeline, as well as a custom Neural Radiance Field (NeRF) model in PyTorch, trained on a lego dataset",
			photo: "/sfm-nerf.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
				"/opencv_logo.png",
				"/pytorch_logo.png",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/SfM-NeRF",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "Depth Camera Data Collection Rig",
			tagline:
				"Three RealSenses fused into 160° ground-truth depth — torch-optimized extrinsic calibration and stitching, built end to end.",
			description:
				"I designed and built a multi-sensor data-collection rig at the PeAR Lab to produce ground-truth depth for a novel depth model — from the physical design and assembly through drivers, precise inter-sensor calibration, and a heavily optimized ROS 2 pipeline. " +
				"Point clouds from 3 Intel RealSense D430s are stitched via torch-based optimization into a 160x40 degree FOV depth image, alongside an L515 LIDAR and an OAK-D Lite.",
			photo: "/stitched_depth.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/ros2_logo.png",
				"/opencv_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			slug: "depth-rig",
			link: "/projects/",
			keywords: [
				"Colin Balfour", "Balfour", "Depth Camera", "Realsense", "LIDAR", "Point Cloud", "ROS2", "Sensor Fusion", "Data Collection", "Robotics",
			],
			page: {
				title: "Depth Camera Data Collection Rig",
				subtitle:
					"A custom multi-sensor rig I designed and built at the PeAR Lab to collect ground-truth depth data for training a novel depth model — hardware, drivers, calibration, and an optimized data pipeline.",
				description:
					"Training a depth network is only as good as its ground truth — and no single off-the-shelf sensor gave us the wide field of view we needed. So I designed and built our own rig, owning it end to end: the physical layout and assembly, the (frequently uncooperative) sensor drivers, the inter-sensor calibration, and the software pipeline that turned raw streams into usable ground truth.\n\n" +
					"## The sensor suite\n\n" +
					"The rig combines **three Intel RealSense D430 stereo cameras**, an **Intel L515 solid-state LIDAR** for high-accuracy reference depth, and an **OAK-D Lite** for RGB and onboard stereo. All streams are time-synchronized and recorded through a **ROS 2** pipeline. Keeping five depth sensors alive on one machine meant wrangling USB bandwidth limits and driver instabilities — much of the rig's reliability came from hardening that layer.\n\n" +
					"![The data collection rig](/data_rig.png)\n\n" +
					"## Calibration & torch-based point-cloud stitching\n\n" +
					"Fusing three overlapping RealSense units into one seamless 160°×40° depth image required **precise extrinsic calibration** between all sensors. I formulated the stitching as a **PyTorch-based optimization**, refining the inter-camera transforms directly against the overlapping point clouds — and spent significant time optimizing the pipeline so it could keep up with the large volume of incoming sensor data.\n\n" +
					"![Stitched depth output](/stitched_depth.png)\n\n" +
					"The resulting wide-FOV depth images serve as the ground truth for training and evaluating depth-estimation models at the lab.",
			},
		},

		{
			title: "Sim2Real Image Segmentation",
			tagline:
				"U-Net trained purely in simulation, segmenting real images zero-shot.",
			description:
				"I trained an implemented a U-Net model from scratch in pytorch using only simulated images. " +
				"The model was able to generalize to real data it had never seen before.",
			photo: "/segmentation.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/blender_logo.png",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Group5_p2/tree/FCN",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "Adversarial Attack on Monocular Depth Neural Network",
			tagline:
				"A printable adversarial patch that forces a SOTA depth network to predict arbitrary depth — in the real world.",
			description:
				"I optimized a real-world adversarial patch that tricked a state-of-the-art depth network into giving wrong predictions. " +
				"The patch was optimized so the model predicts a particular depth in that region, with losses for printability " +
				"and smoothness to improve real-world performance.",
			photo: "/adversarial.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/FelixNgFender/rbe474x_p3",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "FRC Competition Robot",
			tagline:
				"Swerve drive, AprilTag + Kalman localization, and YOLOv8 detection — full competition autonomy on a Jetson.",
			description:
				"For our 2023-2024 season, I created a robust vision pipeline using a Jetson for pose estimation using AprilTags " +
				"and a Kalman Filter, and object detection with YOLOv8. Additionally, I developed code for each subsystem of the robot, " +
				"from a holonomic drive-steer indepdenent drivetrain to an intake/handoff mechanism with an arm, as well as robust fully-autonomous routines (GIF above)",
			photo: "/frc.mp4",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/opencv_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/CCHS-FIRST-Robotics/2024RobotCode/tree/final-bot-testing",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},
		

		{
			title: "Probability of Boundary Edge Detection",
			tagline:
				"Probabilistic boundary detection (pb-lite) that outperforms Canny and Sobel baselines.",
			description:
				"This project implemented a novel method for detecting boundary edges by estimating the probability that a given pixel is an edge" +
				"it is based on the work Contour Detection and Hierarchical Image Segmentation by Pablo Arbelaez et al. " +
				"It uses a large filter bank to create texture, brightness, and color maps, and combines their gradients" + 
				"with canny and sobel baselines to produce a final filtered result",
			photo: "/pblite.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/opencv_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Pb-Edge-Detection/",
		},

		{
			title: "Auto Panogram: Classical & DL Panoramic Image Stitching",
			tagline:
				"Classical stitching (ANMS, RANSAC, Poisson blending) vs. supervised & unsupervised deep homography.",
			description:
				"I implemented a classical panoramic image stitching pipeline using" + 
				"corner feature matching, Asynchronous Non-Maximum Suppression (ANMS), and RANSAC outlier rejection." +
				"Images were then stitched together using homography transforms and Poisson blending." +
				"I also implemented a deep learning-based pipeline, based on the paper Deep Image Homography Estimation by Daniel DeTone et al., " +
				"using both a supervised and unsupervised approach.",
			photo: "/pano.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
				"/opencv_logo.png",
				"/pytorch_logo.png",
				"/scipy_logo.png",
				"/scikit_learn_logo.png",

			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Panoramic-Image-Stitching"
		},

		{
			title: "CIFAR-10 Image Classification (ResNet, ResNeXt, DenseNet)",
			tagline:
				"ResNet, ResNeXt, and DenseNet from raw PyTorch layers, benchmarked head-to-head on CIFAR-10.",
			description:
				"I implemented and compared the performance of ResNet, ResNeXt, and DenseNet on the CIFAR-10 dataset." +
				"These models were all custom-built using only pytorch layers, but no built-in models",
			photo: "/densenet.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/pytorch_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Custom-CIFAR-Classifiers/",
		},

		{
			title: "A* Pathfinding with an MLP Heuristic",
			tagline:
				"A* with a learned heuristic — an MLP written from scratch in NumPy, trained via genetic algorithm.",
			description:
				"In an independent study in machine learning, I developed neural nets from scratch in numpy, compared optimization using Gradient Descent and Newton's Method, and presented to the mathematics department." +
				"Part of this independent study was developing an A* algorithm that used a neural net trained via genetic algorithm to improve the performance of A* and visualize NN learning.",
			photo: "/AStar.mp4",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/ColinBalfour/Pathfinding",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "Robotics Two-Jointed Arm",
			tagline:
				"IK, linear motion profiling, and control for a 2.5-DOF arm — validated in simulation before the hardware existed.",
			description:
				"For our 2022-2023 season, I developed the controls and planning for our 2.5 DOF (wrist had only 3 positions) arm. I developed a simulation in python to test the kinematics, motion profile, and control before we had a physical prototype.",
			date: "7 May 2023",
			logo: ["https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",],
			linkText: "View Project",
			slug: "two-jointed-arm",
			link: "/projects/", // sentinel: resolves to /projects/<slug> (see project.jsx)
			photo: "/arm2.png",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
			page: {
				title: "Robotics Two-Jointed Arm Simulation",
				subtitle: "Complete (but slightly messy) .ipnyb of simulation code is available [here](https://colab.research.google.com/drive/1iUJ9HX-beFWymgUph36at3xYZIWVIzYv?usp=sharing) and the complete robot code can be found [here](https://github.com/CCHS-FIRST-Robotics/2023DriveBase). Below walks through the details of the project:",
				description:
					"For our 2022-2023 season, my FIRST robotics team decided to use a two-jointed arm to pick up the cone and cube game pieces. While I bugged the mechanical group every few hours about getting a prototype we could test code with, I made a simulation in python to iron out as many bugs as possible before then.\n\n" +
					"## Forward Kinematics Model\n\n" +
					"To start, I tested out the kinematics model by visually plotting the output.\n\n" +
					"\n\n![FK plot](/arm1.png)\n\n" +
					"This plot demonstrates the forward kinematics model – given joint angles (a, b), the model calculates the endpoint (x, y). Mathematically this is very simple, and the main purpose of this plot is to show the limits I impose on the model. Each red dot represents a configuration that the robot should avoid, while each green dot represents a configuration that is safe. Note that the overlapping red and green is actually intentional. There are two ways to reach the same (x, y) position – to visualize this, hold out your arm with your elbow pointed down, then rotate your arm so your elbow is pointing up, but your hand is in the same position. In the case of the red dots, one of these configurations goes past a limit. For example, it might be red in the case where the “elbow” is pointed down, where the “elbow” is actually pushing into the ground, whereas the elbow-up position is perfectly fine a few feet above the ground (note that the “ground” is actually a bit below where the start of the arm is on the plot, since on the robot it was a few feet off of the ground).\n\n" +
					"## Inverse Kinematics Model\n\n" +
					"Next, I implemented the inverse kinematics of a two-jointed arm and plotted the output.\n\n" +
					"\n\n![IK plot](/arm2.png)\n\n" +
					"This next image displays the function of the inverse kinematic model. The inverse model takes some (x, y) coordinates as an input, and gives you back an angle for the “shoulder” and an angle for the “elbow” of the arm. This time it shows a bit more elegantly the limits on where the arm could go (we had a large electrical board behind it, hence the wall of red dots). As I mentioned earlier, there are two possible configurations for these angles, one with the elbow pointing up and the other pointing down – since it can be complicated to decide which to use, we opted to always use the configuration with the elbow pointing up, as there were very few situations where we would need the opposite. It’s important to note that we may have wanted to change this in the future, so I made the code adaptable so at any time with a simple parameter change it would return the opposite; or simply use the closest to whatever angle it was already at (to prevent any “sudden flipping” motion).\n\n" +
					"\n\n![IK-2 plot](/arm3.png)\n\n" +
					"This is what it would look like inverted. Many more positions would be completely unreachable because the elbow down position would hit the ground or robot.\n\n" +
					"## Motion Profile\n\n" +
					"Moving on, the next problem was to create a motion profile for the arm to follow. When moving from one point to the other (often large differences), it can be dangerous (both for humans and tensioned chains) if the arm suddenly zips to its next location as fast as it pleases. In addition, it makes it harder to control, since you have less control authority (harder to respond to disturbances). To combat this, a motion profile is used to generate a trajectory (through both time and space) of “setpoints” (targets in space to move to). This will improve the safety, consistency, and effectiveness of the controller.\n\n" +
					"To start, to make motions smooth and direct, I used the inverse kinematics model to generate a linear trajectory, meaning that the “hand” will travel in a straight line from start to finish. This is distinct from the common practice of moving each motor to their final angular positions irrespective of what the other one was doing, which can cause jerky motions. In addition, I placed limits on both the maximum speed and acceleration that the arm could move in: limiting the force on the chains, increasing control authority, and again creating more consistent and smooth motion.\n\n" +
					"\n\n![Motion Profile Animation](/arm4.mp4)\n\n" +
					"This animation shows the motion of the arm through two different trajectories: the blue/orange running with no acceleration constraint but a max speed, and the green/red running with both max acceleration and max speed constraints. Notice how the blue/orange arm starts and stops instantaneously, while the green/red arm speeds up and slows down (they have the same max speed).\n\n" +
					"All of the above simulations (along with many other less interesting graphs) played a key role in the software development for our two-jointed arm. They provided an easy way to debug code by being able to see what’s going wrong, and being able to visually confirm that the code works the way we want it to. Python and matplotlib make it easy to manipulate outputs and dive into what’s going wrong in a way that can be difficult in a full java project. Plus, it’s a really cool way to see what your code is doing.\n\n"
			}
		},

		{
			title: "Self-balancing Two Wheel Robot",
			tagline:
				"IMU + complementary filter + PID: a two-wheel robot that keeps itself upright.",
			description:
				"For an intro electrical engineering final project, I decided to take it a bit further and make a self-balancing two-wheel robot. " +
				"I used an IMU with a complementary filter to get the tilt of the robot, and used PID to keep it upright.",
			photo: "/balance.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png",
			],
			linkText: "View Project",
			// link: "#",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		/* Retired from display (kept for reference) — older non-robotics web
		   projects: Gilded Age Museum and CCHS AP Stats.

		{
			title: "Gilded Age Museum",
			tagline:
				"A virtual museum of the Gilded Age — a history project taken way too far.",
			description:
				"A website I made after getting too deep into a US History project. It's a virtual museum of the Gilded Age, with information and primary sources about industrialization and immigration in the late 1800s.",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/css/css.png",

			],
			linkText: "View Project",
			link: "https://colinbalfour.github.io/GildedAgeMuseum",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "CCHS AP Stats",
			tagline:
				"A platform giving AP Stats students custom links for their experiments — still in use at my school.",
			description:
				"Website so students taking AP Stats could easily advertise their final projects (experimental studies) with customized links (e.g., cchsstats.com/cbalfour) and organized homepage so others could participate in them -- currently working on a 'teacher portal' so my school can use it without me managing it.",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/css/css.png",
			],
			linkText: "View Project",
			link: "https://cchsstats.com",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},
		*/

	],

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
