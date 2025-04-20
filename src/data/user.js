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
		// instagram: "https://instagram.com/",
		// stackoverflow: "https://stackoverflow.com/",
		// facebook: "https://facebook.com/",
	},

	homepage: {
		title: "Robotics software engineer and mathematics enthusiast.",
		description:
			"My name is Colin Balfour, and I'm an aspiring robotics software engineer with interets in control theory and perception. My focus lately has been in Computer Vision and autonomous quadrotors through my work at the PeAR Lab. I also have experience developing complex controllers, motion planning and implementing various SLAM algorithms through my FIRST robotics team. I enjoy solving complex problems and learning new skills. I am passionate about creating high-quality code that follows best practices and industry standards. I am always looking for new challenges and opportunities to grow as a developer.",
	},

	about: {
		title: "I’m Colin Balfour, I live in the Boston area, where I design the future.",
		description:
			"I've worked on a variety of projects over the years and I'm proud of the progress I've made. Many of these projects are open-source and available for others to explore. If you're interested in any of the projects I've worked on, please feel free to check out the code and suggest any improvements or enhancements you might have in mind. Collaborating with others is a great way to learn and grow, and I'm always open to new ideas and feedback.",
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

	articles: {
		title: "I'm passionate about pushing the boundaries of what's possible and inspiring the next generation of innovators.",
		description:
			"Chronological collection of my long-form thoughts on programming, leadership, product design, and more.",
	},

	projects: [
		{
			title: "Classical Structure From Motion (SfM) & Neural Radiance Field (NeRF)",
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
			// link: "#",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},
		{
			title: "Ultrasonic-Based Drone Obstacle Avoidance",
			description:
				"In my work at the PeAR Lab, I designed and built a drone, equipped with an ultrasonic sensor, to autonomously navigate through a cluttered environment. " +
				"I employ signal processing techniques to filter out noise and detect obstacles in real-time. The entire drone, with compute, weighs only 140g. " +
				"Researching deep-learning methods for depth estimation with ultrasound",
			photo: "/drone.png",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://pear.wpi.edu/index.html",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "Depth Camera Data Collection Rig",
			description:
				"In order to get ground-truth depth data for a novel depth model, I designed and built a data-collection rig with a small team at the PeAR Lab. " +
				"It uses stitched pointclouds from 3 Intel Realsense D430 cameras to create a 160x40 degree FOV depth image, as well as an L515 LIDAR and an Oak-D Lite. " +
				"The camera and other sensor data is collected through a ROS2 pipeline",
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
			link: "https://pear.wpi.edu/index.html",
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},

		{
			title: "Sim2Real Image Segmentation",
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
			description:
				"For our 2023-2024 season, I created a robust vision pipeline using a Jetson for pose estimation using AprilTags " +
				"and a Kalman Filter, and object detection with YOLOv8. Additionally, I developed code for each subsystem of the robot, " +
				"from a holonomic drive-steer indepdenent drivetrain to an intake/handoff mechanism with an arm, as well as robust fully-autonomous routines (GIF above)",
			photo: "/frc.gif",
			logo: [
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png",
				"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
				"/opencv_logo.png",
				"/numpy.svg",
			],
			linkText: "View Project",
			link: "https://github.com/CCHS-FIRST-Robotics/2024RobotCode/tree/final-bot-testing", // TODO: SHOULD BE UPDATED, LINK SHOULD NOT DEPEND ON ORDER OF PROJECTS
			keywords: [
				"Colin Balfour", "Balfour", "Colin", "Colin B", "Colin B.", "C Balfour", "Robotics", "Python", "Simulation", "Kinematics", "Inverse Kinematics", "Motion Profile", "FIRST Robotics", 
			],
		},
		

		{
			title: "Probability of Boundary Edge Detection",
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
			description:
				"In an independent study in machine learning, I developed neural nets from scratch in numpy, compared optimization using Gradient Descent and Newton's Method, and presented to the mathematics department." +
				"Part of this independent study was developing an A* algorithm that used a neural net trained via genetic algorithm to improve the performance of A* and visualize NN learning.",
			photo: "/AStar.gif",
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
			description:
				"For our 2022-2023 season, I developed the controls and planning for our 2.5 DOF (wrist had only 3 positions) arm. I developed a simulation in python to test the kinematics, motion profile, and control before we had a physical prototype.",
			date: "7 May 2023",
			logo: ["https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",],
			linkText: "View Project",
			link: "/projects/", // TODO: SHOULD BE UPDATED, LINK SHOULD NOT DEPEND ON ORDER OF PROJECTS
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
					"\n\n![Motion Profile Animation](/arm4.gif)\n\n" +
					"This animation shows the motion of the arm through two different trajectories: the blue/orange running with no acceleration constraint but a max speed, and the green/red running with both max acceleration and max speed constraints. Notice how the blue/orange arm starts and stops instantaneously, while the green/red arm speeds up and slows down (they have the same max speed).\n\n" +
					"All of the above simulations (along with many other less interesting graphs) played a key role in the software development for our two-jointed arm. They provided an easy way to debug code by being able to see what’s going wrong, and being able to visually confirm that the code works the way we want it to. Python and matplotlib make it easy to manipulate outputs and dive into what’s going wrong in a way that can be difficult in a full java project. Plus, it’s a really cool way to see what your code is doing.\n\n"
			}
		},

		{
			title: "Self-balancing Two Wheel Robot",
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

		{
			title: "Gilded Age Museum",
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
			src: "./pear_logo.png",
			alt: "PeAR",
			title: "Perception and Autonomous Robotics (PeAR) Group",
			subtitle: "Student Researcher",
			duration: "2024 - Present",
		},
		{
			id: 1,
			src: "./3205_logo.jpg",
			alt: "3205",
			title: "FIRST Robotics Team 3205",
			subtitle: "Team Captain & Software Lead",
			duration: "2021 - 2024",
		},
		{
			id: 2,
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
			subtitle: "Bachelors of Science in Robotics Engineering (2026)\nMaster of Science in Robotics Engineering (2027)",
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
		{
			id: 2,
			src: "./neu_logo.png",
			alt: "NEU",
			title: "Northeastern University",
			subtitle: "Supplemental Coursework: Advanced Group Theory",
			duration: "Fall 2023",
		},
		{
			id: 3,
			src: "./harvard_logo.png",
			alt: "Harvard",
			title: "Harvard University",
			subtitle: "Supplemental Coursework: Linear Algebra, Vector Calculus, Real Analysis, and Probabiliy Theory/Statistics",
			duration: "Fall 2022, Spring 2023",
		},
		{
			id: 4,
			src: "./uml_logo.png",
			alt: "UML",
			title: "University of Massachussetts - Lowell",
			subtitle: "Supplemental Coursework: Computational Mathematics (Graduate)",
			duration: "Spring 2023",
		},
	],
};

export default INFO;
