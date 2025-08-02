import React, { useState, useEffect, useRef } from "react";
import { GiDeliveryDrone } from "react-icons/gi";
import "./Prize.css";

export default function PrizesSection() {
  
  const [droneStyle, setDroneStyle] = useState({ opacity: 0 }); 
  const sectionRef = useRef(null); 
  const requestRef = useRef();
  const progressRef = useRef(0);

  useEffect(() => {
    
    const animate = () => {
      
      if (sectionRef.current) {
        
        const verticalAmplitude = 300; 
        const speed = 4;             

        
        
        const sectionWidth = sectionRef.current.offsetWidth;
        const sectionHeight = sectionRef.current.offsetHeight;

        
        progressRef.current += 0.01;

        
        
        
        
        const travelWidth = sectionWidth + 200; 

        
        const x = (progressRef.current * speed * 100) % travelWidth - 100;

        
        const y = (sectionHeight / 2) + (Math.sin(progressRef.current * 2) * verticalAmplitude);

        
        const scale = (Math.cos(progressRef.current * 2) + 1) / 2 * 0.5 + 0.75;

        
        const rotation = Math.cos(progressRef.current * 2) * -25;

        
        setDroneStyle({
          opacity: 1, 
          top: `${y}px`,
          left: `${x}px`,
          fontSize: `${scale * 40}px`,
          
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`, 
        });
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    
    requestRef.current = requestAnimationFrame(animate);
    
    
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 

  
  const rewardsData = [
    
    
    { place: "3rd", image: "/assets/THIRD.png", details: "INR 5,000", tier: "bronze" },
    { place: "1st", image: "/assets/FIRST.png", details: "INR 25,000", tier: "gold" },
    { place: "2nd", image: "/assets/SECOND.png", details: "INR 12,000", tier: "silver" },
  ];

  const sortedRewards = rewardsData.sort((a, b) => {
    const order = { gold: 1, silver: 2, bronze: 3 };
    return order[a.tier] - order[b.tier];
  });

  return (
    
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
