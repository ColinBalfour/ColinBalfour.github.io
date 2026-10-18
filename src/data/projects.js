// Project cards + project pages (see the slug convention in CLAUDE.md).
// Edit with `npm run edit` (a local editor UI), or by hand — keep it valid JSON
// after `export default`, since the editor reads and rewrites this file.
// Projects with `hidden: true` are kept for reference but not shown anywhere.

export default [
	{
		"title": "[WIP] Learning to Chase: Vision-Based Drone Pursuit with Adversarial Self-Play",
		"tagline": "My thesis work explores drones that co-evolve in a game of tag: one chasing and one avoiding capture.",
		"description": "Reinforcement learning for drones in massively parallel simulation: chasing a moving target using only onboard vision, and 1v1 pursuit–evasion where both drones learn at the same time. Evader has full-state obs while Pursuer is vision-constriained. Testing onboard soon.",
		"photo": "/selfplay_fpv_pursuit.mp4",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/cuda.svg",
			"/numpy.svg",
			"/blender_logo.png",
			"/ros2_logo.png"
		],
		"linkText": "View Project",
		"pdfFeatured": true,
		"slug": "learning-to-chase",
		"link": "/projects/",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Reinforcement Learning",
			"PPO",
			"Self-Play",
			"Pursuit-Evasion",
			"Quadrotor",
			"Drone",
			"Isaac Lab",
			"Isaac Sim",
			"Newton",
			"Warp",
			"Sim2Real",
			"Vision-Based Tracking",
			"Robotics"
		],
		"page": {
			"title": "Learning to Chase: Vision-Based Drone Pursuit",
			"subtitle": "Reinforcement learning for drones in massively parallel simulation: chasing a moving target using only onboard vision, and 1v1 pursuit–evasion where both drones learn at the same time. Evader has full-state obs while Pursuer is vision-constriained. Testing onboard soon.",
			"description": "![The pursuer's view of the chase](/selfplay_fpv_pursuit.mp4)\n\n## Setup\n\n- **Simulator:** Isaac Lab + Newton, 2048 environments on one GPU, with custom Warp collision kernels.\n- **Policy:** PPO. It sees a depth image, a mask of the target, and its own state, but never the target's position. It outputs velocity commands, or thrust and body rates at 50 Hz.\n- **Training:** Uses a unique state-setter approach with adaptive sampling for better large-batch scaling and efficient training.\n\n## Key results\n*note that this is in-progress work, so results are preliminary and plots/results are not final*\n\n### Vision-based tracking\nTracking a fixed or scripted movement target\n\n![Capture rate by starting situation](/fig_tracking_reset_families.png)\n\n- With velocity control, the drone catches the target **97–100%** of the time from easy starts and **53–72%** from hard ones.\n- Body-rate control started at **0%**: the untrained policy crashed before it could learn anything. I added proprioception to the observations (accel & velocity), which was able to improve the SR: **88 / 81 / 75%**. Interestingly, adding a position obs mildly degraded performance.\n\n### Self-play pursuit–evasion\n\n![Pursuer wins](/selfplay_capture_room.mp4)\n\n![Evader wins, with the same two policies](/selfplay_escape.mp4)\n\n![Every pursuer checkpoint played against every evader checkpoint](/fig_selfplay_crosseval.png)\n\n- Pursuers peaked at rounds 4–8 (**0.41–0.43** capture rate), then got worse. The round-12 evader held every pursuer under **0.06**.\n- Plain self-play scored highest (**0.82**), but only because the evader collapsed and stopped trying. Training against a pool of past opponents prevented this.\n- Since the evader under our constraints has an observational advantage, it's expected to win at convergence. Next will impose other visibility or dynamics constraints on the evader to balance the problem.\n\n## Lessons\n\n- **Run-to-run noise is large.** Identical runs scored anywhere from **55.7% to 79.9%**, so I now test 3+ seeds. \n- **Reward hacking caps performance.** Like any RL policy, I found and fixed seven reward exploits. In one, the policy would just crash into a wall, because ending the episode cost less than staying alive.\n\n## Current work\n- Testing policies onboard to validate sim2real performance\n- Integrating sparse/terminal rewards to reduce skill ceiling\n- Combing adaptive reset sampling with PFSP to work better in self-play \n- Introducing evader dynamics constraints\n\n## Stack\n\nPython, PyTorch, rsl_rl (PPO), Isaac Lab + Newton, Warp, Blender, PX4 / ROS 2"
		}
	},
	{
		"title": "TerminalRL: Learning from Sparse Rewards in Fast Simulators",
		"date": "2026",
		"tagline": "A self-play Rocket League bot that beats professional players in 1v1-3v3, and a robot arm that learns manipulation from success-only rewards.",
		"description": "RL policies trained from sparse, outcome-only rewards in fast simulators, with curricula over start states. Terminal is a Rocket League bot trained by self-play in RocketSim: it won 100% of games (n=256) against established community bots (Nexto, Kiyo, Kilobyte) across 1v1, 2v2, and 3v3, and is entered in the RLBot Championship 2026 (Nov). clothrl trains a Franka arm with PPO across 1,024 parallel environments to insert a cork (0.99 success), stack cubes (0.999), and drape cloth (1.00). ",
		"photo": "/terminalrl_montage.mp4",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/cuda.svg"
		],
		"linkText": "View Project",
		"link": "https://terminalrl.github.io/",
		"keywords": [
			"Colin Balfour",
			"TerminalRL",
			"Reinforcement Learning",
			"Self-Play",
			"Rocket League",
			"RocketSim",
			"RLBot",
			"Sparse Reward",
			"Robot Manipulation",
			"Franka",
			"PPO"
		]
	},
	{
		"title": "[Science Robotics 2026] Saranga: milliWatt Ultrasound Navigation on Palm-Sized Drones",
		"date": "2024-2025",
		"tagline": "Autonomous flight through darkness, smoke, and snow on a 140g drone — milliwatt ultrasound + learned denoising. Science Robotics 2026.",
		"description": "Saranga is the first palm-sized aerial robot capable of autonomous navigation in complete darkness, smoke, and snow — using only onboard milliWatt ultrasound sensing and compute, at just 140g. I employ deep-learning signal processing to suppress noise and estimate depth in real time, achieving 84% success across 10 scenes (200+ trials). Published in Science Robotics (2026).",
		"photo": "/saranga.jpg",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"pdfFeatured": true,
		"link": "https://pear.wpi.edu/research/saranga.html",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "[Under Review — ICRA 2027] ActiveNav: Learning Active Monocular Flight in Forests",
		"date": "2025-2026",
		"tagline": "Hierarchical RL that aims the camera mid-flight. 80% success in unseen forests, zero-shot sim2real on a Jetson.",
		"description": "ActiveNav is a novel approach for quadrotor navigation using active perception. With flow and its uncertainty as an input, a hierarchical RL policy actively controls the drone's camera along with its movement. The policy is able to actively point the camera to areas that would improve perception and avoid obstacles. The model was able to generalize zero-shot to the real world, running onboard a Jetson Nano.",
		"photo": "/activenav.jpg",
		"logo": [
			"/pytorch_logo.png",
			"/blender_logo.png",
			"/opencv_logo.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"pdfFeatured": true,
		"slug": "activenav",
		"link": "/projects/",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"ActiveNav",
			"Active Perception",
			"Reinforcement Learning",
			"Drone",
			"Quadrotor",
			"Monocular",
			"Optical Flow",
			"Robotics",
			"ICRA"
		],
		"page": {
			"title": "ActiveNav: Learning Active Monocular Flight in Forests",
			"subtitle": "Under review at **ICRA 2027**, with K. Srivastava (equal contrib), D. Singh, and N. Sanket (PeAR Lab).",
			"description": "A drone learns to move its camera, not just its body, so it can see obstacles better while flying through a forest.\n\n![ActiveNav forest flight](/speedmeter_web.mp4)\n\n## How it works\n\nA hierarchical RL policy takes optical flow and its uncertainty as input. It outputs both flight commands and a camera yaw angle, and learns to point the camera where it's least sure what's ahead.\n\nA master policy is chosen to select between three options: a subpolicy trained with the full action space (3d vel + camera yaw), a subpolicy trained with a restricted action space (3d vel), and a global planner/movement direction (i.e., \"go straight\").\n\nThis formulation allows for a simpler path for the policy to learn when and when not to turn, as yaw motion degrades optical flow's quality as a depth/navigation cue.\n\n## Key results\n\n- **80% success** in three cluttered forest scenes it never saw during training.\n- Trained only in simulation, and transfers **zero-shot** to the real drone.\n- Runs fully onboard a **Jetson Nano**.\n\n![Onboard view](/activenav.jpg)"
		}
	},
	{
		"title": "[Under Review — RA-L 2026] AttentionSeeker: Passive Attention-Based Aerial Navigation with Events",
		"date": "2025-2026",
		"tagline": "Passive attention from defocus in event streams high-speed forest flight with no frames and no depth sensor. With D. Singh and N. Sanket (PeAR Lab)",
		"description": "While I can't share too many details just yet, the core idea is to use reinforcement learning with an optics-driven approach to navigate with only a single event camera, which is very tricky because it has no natural depth cues or rich color/textural information (which monocular rgb depth models use) to infer depth. The most challenging part about this project (and often event-cameras in general) was how to formulate the policy input to prevent sim2real issues.",
		"photo": "/Events_Video.mp4",
		"slug": "attentionseeker",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/numpy.svg",
			"/cuda.svg",
			"/blender_logo.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png"
		],
		"linkText": "View Project",
		"pdfFeatured": true,
		"link": "/projects/",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"AttentionSeeker",
			"Event Camera",
			"Defocus",
			"Attention",
			"Reinforcement Learning",
			"Drone",
			"Aerial Navigation",
			"RA-L",
			"Robotics"
		],
		"page": {
			"title": "AttentionSeeker: Using Defocus in Events for Passive Attention-Based Aerial Navigation",
			"subtitle": "Under review at **RA-L 2026**, with D. Singh* and N. Sanket (PeAR Lab). *Equal contribution.",
			"description": "Event cameras only report pixels whose brightness changes, so when the drone moves, almost everything fires. AttentionSeeker uses lens defocus as a filter: objects at the focus distance produce sharp events, and everything else blurs out. That picks out obstacles at the range that matters.\n\n![Event stream from a simulated forest flight](/Events_Video.mp4)\n\n## Key results\n\n- RL policies fly a drone through dense forest at high speed using **only events**, with no frames and no depth sensor.\n- The attention comes from the lens itself, so it needs **no extra compute, power, or moving parts**."
		}
	},
	{
		"title": "Agile Event-based Flight through Cluttered Environments",
		"tagline": "Event-camera depth + topological replanning on a custom-built quadrotor. Best MQP Award Finalist.",
		"description": "My WPI senior capstone (MQP), and a Best MQP Award Finalist: a full event-camera perception, planning, and control stack that flies a custom-built quadrotor through dense, cluttered environments.",
		"date": "2025-2026",
		"logo": [
			"/pytorch_logo.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
			"/ros2_logo.png",
			"/opencv_logo.png",
			"/cuda.svg"
		],
		"linkText": "View Project",
		"slug": "agile-event-flight",
		"link": "/projects/",
		"photo": "/mqp_flight.mp4",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"MQP",
			"WPI",
			"Event Camera",
			"Drone",
			"Quadrotor",
			"Autonomous Navigation",
			"Motion Planning",
			"Deep Learning",
			"Reinforcement Learning",
			"Robotics"
		],
		"page": {
			"title": "Agile Event-based Flight through Cluttered Environments",
			"subtitle": "My WPI senior capstone (MQP) and a **Best MQP Award Finalist**. With Rohan Inamdar and Evan Kaba, advised by Guanrui Li and Nitin Sanket.",
			"links": [
				{
					"label": "📄 Read the Project Report",
					"url": "https://drive.google.com/file/d/1a4dQrtl8_N-TtYmtHigq0v0pnoG3NXzc/view",
					"primary": true
				},
				{
					"label": "▶ Skip to the Flight Tests",
					"url": "https://youtu.be/vZI_f9TqJVw?t=155"
				}
			],
			"video": "vZI_f9TqJVw",
			"description": "We built a full autonomy stack for a custom quadrotor that flies through cluttered obstacle courses.\n\n## Perception\n\nWe treat the event stream as a 3D point cloud and train a network to predict dense depth from it ([Fast-Feature-Fields](https://www.google.com/goto?url=CAEScgHrOzAVKC_8QxuGkN08YCPc9QjAkyntQxceQ6kwdfMDw_Go-CUnNbrtBK-UPREMDXPdFbCjbbG59p54BOjB8Xil_aNtEdgDd5udzogxoqXCm_14Z1unDlXvHfHHPpdnhyJAaQBNASWRWs2xhKKpZDMQtg)).\n\n## Planning\n\nFrom the predicted depth we build a map and plan with a Fast-Planner-style topological search. It finds several distinct routes and smooths them into flyable B-spline trajectories, then replans in real time as new obstacles come into view.\n\n![Topological replanning](/mqp_planner.jpg)\n\n## Hardware\n\nWe designed and built a custom carbon-fiber quadrotor to carry the event camera and compute.\n\n![Custom quadrotor](/mqp_drone.jpg)\n\n## Results\n\n- Flew autonomously through dense obstacle courses with **only onboard sensing and compute**.\n- **Best MQP Award Finalist** at WPI.\n\n![The drone (bottom right) flying the course, with the onboard point cloud in the inset](/mqp_flight.mp4)"
		}
	},
	{
		"title": "Einstein Vision: a Full-Self Driving Perception Stack",
		"date": "2025",
		"tagline": "3D object tracking, lanes, depth, and collision prediction, an AV perception stack from one camera.",
		"description": "FSD perception stack for a self-driving car, using a variety of models with only a single camera. Pre-trained models were used for object detection, depth estimation, optical flow, and instance segmentation. Objects are tracked in 3D, along with collision prediction, motion detection, and lane detection. ",
		"photo": "/einstein-vision.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/blender_logo.png",
			"/opencv_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"pdfFeatured": true,
		"link": "https://github.com/ColinBalfour/Einstein-Vision",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Computer Vision",
			"Self Driving",
			"Autonomous Car",
			"AI",
			"Deep Learning"
		]
	},
	{
		"title": "Classical Structure From Motion (SfM) & Neural Radiance Field (NeRF)",
		"date": "2025",
		"tagline": "Full classical SfM pipeline + a NeRF implemented from scratch in PyTorch.",
		"description": "Reconstructing a scene, both classically and with deep learning. Developed a omplete classical Structure-from-Motion pipeline, as well as a custom Neural Radiance Field (NeRF) model in PyTorch, trained on a lego dataset",
		"photo": "/sfm-nerf.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/numpy.svg",
			"/opencv_logo.png",
			"/pytorch_logo.png"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/SfM-NeRF",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "Depth Camera Data Collection Rig",
		"date": "2024",
		"tagline": "Three RealSenses fused into 160° ground-truth depth — torch-optimized extrinsic calibration and stitching, built end to end.",
		"description": "I designed and built a multi-sensor data-collection rig at the PeAR Lab to produce ground-truth depth for a novel depth model, from the physical design and assembly through drivers, precise inter-sensor calibration, and a heavily optimized ROS 2 pipeline. Point clouds from 3 Intel RealSense D430s are stitched via torch-based optimization into a 160x40 degree FOV depth image, alongside an L515 LIDAR and an OAK-D Lite.",
		"photo": "/stitched_depth.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/ros2_logo.png",
			"/opencv_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"slug": "depth-rig",
		"link": "/projects/",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Depth Camera",
			"Realsense",
			"LIDAR",
			"Point Cloud",
			"ROS2",
			"Sensor Fusion",
			"Data Collection",
			"Robotics"
		],
		"page": {
			"title": "Depth Camera Data Collection Rig",
			"subtitle": "A multi-sensor rig I designed and built at the PeAR Lab to collect ground-truth depth for training depth models.",
			"description": "No single sensor had the wide field of view we needed, so I built a rig. I handled it end to end: hardware, drivers, calibration, and the data pipeline.\n\n## Sensors\n\n- 3× Intel RealSense D430 stereo cameras\n- Intel L515 LIDAR for reference depth\n- OAK-D Lite for RGB and stereo\n\nAll streams are time-synced and recorded through ROS 2.\n\n![The data collection rig](/data_rig.png)\n\n## Stitching\n\nI calibrated the three RealSense cameras against each other by optimizing their relative poses in PyTorch on the overlapping point clouds, then merged them into one depth image.\n\n![Stitched depth output](/stitched_depth.png)\n\n## Result\n\n- One **160° × 40°** depth image from three cameras, used as ground truth for training and evaluating the lab's depth models."
		}
	},
	{
		"title": "Sim2Real Image Segmentation",
		"date": "2024",
		"tagline": "U-Net trained purely in simulation, segmenting real images zero-shot.",
		"description": "I trained an implemented a U-Net model from scratch in pytorch using only simulated images. The model was able to generalize to real data it had never seen before.",
		"photo": "/segmentation.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/blender_logo.png"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/Group5_p2/tree/FCN",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "Adversarial Attack on Monocular Depth Neural Network",
		"date": "2024",
		"tagline": "A printable adversarial patch that forces a SOTA depth network to predict arbitrary depth — in the real world.",
		"description": "I optimized a real-world adversarial patch that tricked a state-of-the-art depth network into giving wrong predictions. The patch was optimized so the model predicts a particular depth in that region, with losses for printability and smoothness to improve real-world performance.",
		"photo": "/adversarial.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"link": "https://github.com/FelixNgFender/rbe474x_p3",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "FRC Competition Robot",
		"date": "2022-2024",
		"tagline": "Swerve drive, AprilTag + Kalman localization, and YOLOv8 detection — full competition autonomy on a Jetson.",
		"description": "For our 2023-2024 season, I created a robust vision pipeline using a Jetson for pose estimation using AprilTags and a Kalman Filter, and object detection with YOLOv8. Additionally, I developed code for each subsystem of the robot, from a holonomic drive-steer indepdenent drivetrain to an intake/handoff mechanism with an arm, as well as robust fully-autonomous routines (GIF above)",
		"photo": "/frc.mp4",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/opencv_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"link": "https://github.com/CCHS-FIRST-Robotics/2024RobotCode/tree/final-bot-testing",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "Probability of Boundary Edge Detection",
		"date": "2024",
		"tagline": "Probabilistic boundary detection (pb-lite) that outperforms Canny and Sobel baselines.",
		"description": "This project implemented a novel method for detecting boundary edges by estimating the probability that a given pixel is an edgeit is based on the work Contour Detection and Hierarchical Image Segmentation by Pablo Arbelaez et al. It uses a large filter bank to create texture, brightness, and color maps, and combines their gradientswith canny and sobel baselines to produce a final filtered result",
		"photo": "/pblite.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/opencv_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/Pb-Edge-Detection/"
	},
	{
		"title": "Auto Panogram: Classical & DL Panoramic Image Stitching",
		"date": "2025",
		"tagline": "Classical stitching (ANMS, RANSAC, Poisson blending) vs. supervised & unsupervised deep homography.",
		"description": "I implemented a classical panoramic image stitching pipeline usingcorner feature matching, Asynchronous Non-Maximum Suppression (ANMS), and RANSAC outlier rejection.Images were then stitched together using homography transforms and Poisson blending.I also implemented a deep learning-based pipeline, based on the paper Deep Image Homography Estimation by Daniel DeTone et al., using both a supervised and unsupervised approach.",
		"photo": "/pano.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/numpy.svg",
			"/opencv_logo.png",
			"/pytorch_logo.png",
			"/scipy_logo.png",
			"/scikit_learn_logo.png"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/Panoramic-Image-Stitching"
	},
	{
		"title": "CIFAR-10 Image Classification (ResNet, ResNeXt, DenseNet)",
		"date": "2025",
		"tagline": "ResNet, ResNeXt, and DenseNet from raw PyTorch layers, benchmarked head-to-head on CIFAR-10.",
		"description": "I implemented and compared the performance of ResNet, ResNeXt, and DenseNet on the CIFAR-10 dataset.These models were all custom-built using only pytorch layers, but no built-in models",
		"photo": "/densenet.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/pytorch_logo.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/Custom-CIFAR-Classifiers/"
	},
	{
		"title": "A* Pathfinding with an MLP Heuristic",
		"date": "2021",
		"tagline": "A* with a learned heuristic — an MLP written from scratch in NumPy, trained via genetic algorithm.",
		"description": "In an independent study in machine learning, I developed neural nets from scratch in numpy, compared optimization using Gradient Descent and Newton's Method, and presented to the mathematics department.Part of this independent study was developing an A* algorithm that used a neural net trained via genetic algorithm to improve the performance of A* and visualize NN learning.",
		"photo": "/AStar.mp4",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png",
			"/numpy.svg"
		],
		"linkText": "View Project",
		"link": "https://github.com/ColinBalfour/Pathfinding",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "Robotics Two-Jointed Arm",
		"tagline": "IK, linear motion profiling, and control for a 2.5-DOF arm — validated in simulation before the hardware existed.",
		"description": "For our 2022-2023 season, I developed the controls and planning for our 2.5 DOF (wrist had only 3 positions) arm. I developed a simulation in python to test the kinematics, motion profile, and control before we had a physical prototype.",
		"date": "2023",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png"
		],
		"linkText": "View Project",
		"slug": "two-jointed-arm",
		"link": "/projects/",
		"photo": "/arm2.png",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		],
		"page": {
			"title": "Robotics Two-Jointed Arm Simulation",
			"subtitle": "Complete (but slightly messy) .ipnyb of simulation code is available [here](https://colab.research.google.com/drive/1iUJ9HX-beFWymgUph36at3xYZIWVIzYv?usp=sharing) and the complete robot code can be found [here](https://github.com/CCHS-FIRST-Robotics/2023DriveBase). Below walks through the details of the project:",
			"description": "For our 2022-2023 season, my FIRST robotics team decided to use a two-jointed arm to pick up the cone and cube game pieces. While I bugged the mechanical group every few hours about getting a prototype we could test code with, I made a simulation in python to iron out as many bugs as possible before then.\n\n## Forward Kinematics Model\n\nTo start, I tested out the kinematics model by visually plotting the output.\n\n\n\n![FK plot](/arm1.png)\n\nThis plot demonstrates the forward kinematics model – given joint angles (a, b), the model calculates the endpoint (x, y). Mathematically this is very simple, and the main purpose of this plot is to show the limits I impose on the model. Each red dot represents a configuration that the robot should avoid, while each green dot represents a configuration that is safe. Note that the overlapping red and green is actually intentional. There are two ways to reach the same (x, y) position – to visualize this, hold out your arm with your elbow pointed down, then rotate your arm so your elbow is pointing up, but your hand is in the same position. In the case of the red dots, one of these configurations goes past a limit. For example, it might be red in the case where the “elbow” is pointed down, where the “elbow” is actually pushing into the ground, whereas the elbow-up position is perfectly fine a few feet above the ground (note that the “ground” is actually a bit below where the start of the arm is on the plot, since on the robot it was a few feet off of the ground).\n\n## Inverse Kinematics Model\n\nNext, I implemented the inverse kinematics of a two-jointed arm and plotted the output.\n\n\n\n![IK plot](/arm2.png)\n\nThis next image displays the function of the inverse kinematic model. The inverse model takes some (x, y) coordinates as an input, and gives you back an angle for the “shoulder” and an angle for the “elbow” of the arm. This time it shows a bit more elegantly the limits on where the arm could go (we had a large electrical board behind it, hence the wall of red dots). As I mentioned earlier, there are two possible configurations for these angles, one with the elbow pointing up and the other pointing down – since it can be complicated to decide which to use, we opted to always use the configuration with the elbow pointing up, as there were very few situations where we would need the opposite. It’s important to note that we may have wanted to change this in the future, so I made the code adaptable so at any time with a simple parameter change it would return the opposite; or simply use the closest to whatever angle it was already at (to prevent any “sudden flipping” motion).\n\n\n\n![IK-2 plot](/arm3.png)\n\nThis is what it would look like inverted. Many more positions would be completely unreachable because the elbow down position would hit the ground or robot.\n\n## Motion Profile\n\nMoving on, the next problem was to create a motion profile for the arm to follow. When moving from one point to the other (often large differences), it can be dangerous (both for humans and tensioned chains) if the arm suddenly zips to its next location as fast as it pleases. In addition, it makes it harder to control, since you have less control authority (harder to respond to disturbances). To combat this, a motion profile is used to generate a trajectory (through both time and space) of “setpoints” (targets in space to move to). This will improve the safety, consistency, and effectiveness of the controller.\n\nTo start, to make motions smooth and direct, I used the inverse kinematics model to generate a linear trajectory, meaning that the “hand” will travel in a straight line from start to finish. This is distinct from the common practice of moving each motor to their final angular positions irrespective of what the other one was doing, which can cause jerky motions. In addition, I placed limits on both the maximum speed and acceleration that the arm could move in: limiting the force on the chains, increasing control authority, and again creating more consistent and smooth motion.\n\n\n\n![Motion Profile Animation](/arm4.mp4)\n\nThis animation shows the motion of the arm through two different trajectories: the blue/orange running with no acceleration constraint but a max speed, and the green/red running with both max acceleration and max speed constraints. Notice how the blue/orange arm starts and stops instantaneously, while the green/red arm speeds up and slows down (they have the same max speed).\n\nAll of the above simulations (along with many other less interesting graphs) played a key role in the software development for our two-jointed arm. They provided an easy way to debug code by being able to see what’s going wrong, and being able to visually confirm that the code works the way we want it to. Python and matplotlib make it easy to manipulate outputs and dive into what’s going wrong in a way that can be difficult in a full java project. Plus, it’s a really cool way to see what your code is doing.\n\n"
		}
	},
	{
		"title": "Self-balancing Two Wheel Robot",
		"date": "2022",
		"tagline": "IMU + complementary filter + PID: a two-wheel robot that keeps itself upright.",
		"description": "For an intro electrical engineering final project, I decided to take it a bit further and make a self-balancing two-wheel robot. I used an IMU with a complementary filter to get the tilt of the robot, and used PID to keep it upright.",
		"photo": "/balance.png",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png"
		],
		"linkText": "View Project",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		]
	},
	{
		"title": "Gilded Age Museum",
		"tagline": "A virtual museum of the Gilded Age — a history project taken way too far.",
		"description": "A website I made after getting too deep into a US History project. It's a virtual museum of the Gilded Age, with information and primary sources about industrialization and immigration in the late 1800s.",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/css/css.png"
		],
		"linkText": "View Project",
		"link": "https://colinbalfour.github.io/GildedAgeMuseum",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		],
		"hidden": true
	},
	{
		"title": "CCHS AP Stats",
		"tagline": "A platform giving AP Stats students custom links for their experiments — still in use at my school.",
		"description": "Website so students taking AP Stats could easily advertise their final projects (experimental studies) with customized links (e.g., cchsstats.com/cbalfour) and organized homepage so others could participate in them -- currently working on a 'teacher portal' so my school can use it without me managing it.",
		"logo": [
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png",
			"https://cdn.jsdelivr.net/npm/programming-languages-logos/src/css/css.png"
		],
		"linkText": "View Project",
		"link": "https://cchsstats.com",
		"keywords": [
			"Colin Balfour",
			"Balfour",
			"Colin",
			"Colin B",
			"Colin B.",
			"C Balfour",
			"Robotics",
			"Python",
			"Simulation",
			"Kinematics",
			"Inverse Kinematics",
			"Motion Profile",
			"FIRST Robotics"
		],
		"hidden": true
	}
];
