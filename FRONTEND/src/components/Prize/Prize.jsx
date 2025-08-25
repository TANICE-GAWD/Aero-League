import React, { useState, useEffect, useRef } from "react";
import { GiDeliveryDrone } from "react-icons/gi";
import { FaCrown, FaTrophy, FaLightbulb, FaUsers, FaRupeeSign, FaListUl, FaCheckCircle } from "react-icons/fa";
import { IoMdRibbon } from "react-icons/io";
import "./Prize.css";


export default function PrizesSection() {
  const [droneStyle, setDroneStyle] = useState({ opacity: 0 });
  const sectionRef = useRef(null);
  const requestRef = useRef();
  const progressRef = useRef(0);

  
  useEffect(() => {
    const animate = () => {
      if (sectionRef.current) {
        const verticalAmplitude = 200;
        const speed = 10;

        const sectionWidth = sectionRef.current.offsetWidth;
        const sectionHeight = sectionRef.current.offsetHeight;

        progressRef.current += 0.005;

        const travelWidth = sectionWidth + 200;
        const x = (progressRef.current * speed * 100) % travelWidth - 100;
        const y = (sectionHeight / 2) + (Math.sin(progressRef.current * 2) * verticalAmplitude);
        const scale = (Math.cos(progressRef.current * 2) + 1) / 2 * 0.5 + 0.75;
        const rotation = Math.cos(progressRef.current * 2) * -25;

        setDroneStyle({
          opacity: 1,
          top: `${y}px`,
          left: `${x}px`,
          fontSize: `${scale * 80}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  
  const prizeData = [
    {
      icon: <FaCrown />,
      title: "1st Place Reward",
      amount: "₹ 25,000",
      tier: "gold",
    },
    {
      icon: <IoMdRibbon />,
      title: "2nd Place Reward",
      amount: "₹ 12,000",
      tier: "silver",
    },
    {
      icon: <FaLightbulb />,
      title: "3rd Place Reward",
      amount: "₹ 5,000",
      tier: "bronze",
    },
    {
      icon: <FaTrophy />,
      title: "Strategic Dash Winner",
      amount: "₹ 10,000",
      tier: "red",
    },
  ];




  return (
    <section className="prizes-parent-section">
      <div className="prizes-section" ref={sectionRef}>
        {/* The animated drone */}
        <div className="drone-icon-wrapper" style={droneStyle}>
          <div className="drone-icon">
            <GiDeliveryDrone />
          </div>
        </div>

        <div className="prizes-container">
          <h2 className="prizes-title">Prizes and Opportunities</h2>
          <p className="prizes-subtitle"></p>

          {/* Single row for all prize cards */}
          <div className="prizes-single-row">
            {prizeData.map((prize) => (
              <div key={prize.tier} className={`prize-card prize-card--${prize.tier}`}>
                <div className="prize-card-icon">{prize.icon}</div>
                <h3 className="prize-card-title">{prize.title}</h3>
                <p className="prize-card-amount">{prize.amount}</p>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
