import React, { useState, useEffect, useRef } from "react";
import { GiDeliveryDrone } from "react-icons/gi";
import "./Prize.css";

export default function PrizesSection() {
  // --- Animation State and Logic ---
  const [droneStyle, setDroneStyle] = useState({ opacity: 0 }); // Start invisible
  const sectionRef = useRef(null); // Ref for the main section container
  const requestRef = useRef();
  const progressRef = useRef(0);

  useEffect(() => {
    // The animation loop function
    const animate = () => {
      // Ensure the component is mounted before running calculations
      if (sectionRef.current) {
        // --- Animation Parameters ---
        const verticalAmplitude = 150; // The height of the helix wave
        const speed = 1.5;             // Controls the horizontal speed of the drone

        // Get the dimensions of the container section on each frame
        // This makes the animation responsive to window resizing
        const sectionWidth = sectionRef.current.offsetWidth;
        const sectionHeight = sectionRef.current.offsetHeight;

        // Increment animation progress
        progressRef.current += 0.01;

        // --- Contained Helical Path Calculation ---
        
        // The total distance the drone travels horizontally before looping.
        // We add a buffer so it flies completely off-screen for a seamless loop.
        const travelWidth = sectionWidth + 200; 

        // X position progresses across the container's width and wraps around.
        const x = (progressRef.current * speed * 100) % travelWidth - 100;

        // Y position is a sine wave, vertically centered within the section.
        const y = (sectionHeight / 2) + (Math.sin(progressRef.current * 2) * verticalAmplitude);

        // Z-axis (depth) is simulated by scaling the icon's size.
        const scale = (Math.cos(progressRef.current * 2) + 1) / 2 * 0.5 + 0.75;

        // Rotation makes the drone tilt realistically along its path.
        const rotation = Math.cos(progressRef.current * 2) * -25;

        // Update the style state for the drone element
        setDroneStyle({
          opacity: 1, // Make it visible once the first position is calculated
          top: `${y}px`,
          left: `${x}px`,
          fontSize: `${scale * 40}px`,
          // This transform centers the icon on its calculated (x, y) coordinates
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`, 
        });
      }
      // Continue the loop
      requestRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup function to stop the animation when the component is unmounted
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // --- Prize Card Data and Logic ---
  const rewardsData = [
    // Using picsum.photos for runnable demo images.
    // Replace these with your actual asset paths like "/assets/THIRD.png".
    { place: "3rd", image: "/assets/THIRD.png", details: "INR 5,000", tier: "bronze" },
    { place: "1st", image: "/assets/FIRST.png", details: "INR 25,000", tier: "gold" },
    { place: "2nd", image: "/assets/SECOND.png", details: "INR 12,000", tier: "silver" },
  ];

  const sortedRewards = rewardsData.sort((a, b) => {
    const order = { gold: 1, silver: 2, bronze: 3 };
    return order[a.tier] - order[b.tier];
  });

  return (
    // The ref is attached here to get the component's bounds for the animation
    <section className="team-section">

      <section className="prizes-section" ref={sectionRef}>
        {/* The animated drone is now a direct child of the positioned section */}
        <div className="drone-icon-wrapper" style={droneStyle}>
          <div className="drone-icon">
            <GiDeliveryDrone />
          </div>
        </div>

        <div className="prizes-container">
          <h2 className="prizes-title">CHAMPION'S REWARDS</h2>
          <div className="prizes-grid">
            {sortedRewards.map((reward) => (
              <div key={reward.tier} className={`prize-card-group prize-card-group--${reward.tier}`}>
                <div className="prize-card">
                  <div className="card-front">
                    <img
                      src={reward.image}
                      alt={`${reward.place} Place Trophy`}
                      className="prize-image"
                    />
                    <p className="prize-place">{reward.place} Place</p>
                  </div>
                  <div className="card-back">
                    <p className="prize-details-title">{reward.place} Place Reward</p>
                    <p className="prize-details">{reward.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
