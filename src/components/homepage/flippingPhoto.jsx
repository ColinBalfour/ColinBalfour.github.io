import React, { useState, useEffect } from "react";
import "./styles/flippingPhoto.css";

const FlippingPhoto = ({ 
	images, 
	photoNumber, 
	animationDelay = 0,
	animationDuration = 8,
	pendulumDuration = 6
}) => {
	const [nextImageIndex, setNextImageIndex] = useState(1);
	const [frontImageIndex, setFrontImageIndex] = useState(0);
	const [backImageIndex, setBackImageIndex] = useState(images.length > 1 ? 1 : 0);
	const [currentAnimation, setCurrentAnimation] = useState('flip-to-back');

	// Only use carousel logic if there are more than 2 images
	const isCarousel = images.length > 2;

	useEffect(() => {
		if (!isCarousel) return; // Skip carousel logic for 2-image photos

		const photoCard = document.querySelector(`.photo-${photoNumber} .photo-card`);
		
		const handleAnimationStart = (e) => {
			if (e.animationName === `flipToBack${photoNumber}`) {
				setBackImageIndex(nextImageIndex);
				setNextImageIndex((nextImageIndex + 1) % images.length);
			} else if (e.animationName === `flipToFront${photoNumber}`) {
				setFrontImageIndex(nextImageIndex);
				setNextImageIndex((nextImageIndex + 1) % images.length);
			}
		};
		
		const handleAnimationEnd = (e) => {
			if (e.animationName === `flipToBack${photoNumber}`) {
				setCurrentAnimation('flip-to-front');
			} else if (e.animationName === `flipToFront${photoNumber}`) {
				setCurrentAnimation('flip-to-back');
			}
		};

		if (photoCard) {
			photoCard.addEventListener('animationstart', handleAnimationStart);
			photoCard.addEventListener('animationend', handleAnimationEnd);
		}

		return () => {
			if (photoCard) {
				photoCard.removeEventListener('animationstart', handleAnimationStart);
				photoCard.removeEventListener('animationend', handleAnimationEnd);
			}
		};
	}, [images.length, nextImageIndex, photoNumber, isCarousel]);

	return (
		<div 
			className={`photo-wrapper photo-${photoNumber}`}
			style={{
				'--animation-delay': `${animationDelay}s`,
				'--animation-duration': `${animationDuration}s`,
				'--pendulum-duration': `${pendulumDuration}s`
			}}
		>
			<div className="string"></div>
			<div className={`photo-card ${isCarousel ? currentAnimation : ''}`}>
				<img src={images[frontImageIndex]} alt={`Portfolio ${photoNumber} - Front`} />
				<img src={images[backImageIndex]} alt={`Portfolio ${photoNumber} - Back`} />
			</div>
		</div>
	);
};

export default FlippingPhoto;
