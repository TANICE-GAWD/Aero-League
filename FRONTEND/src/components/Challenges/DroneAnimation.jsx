import React, { useState } from 'react';
import './DroneAnimation.css'; 

/**
 * A self-contained SVG drone icon component.
 */
const DroneIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    {...props}
  >
    {/* Main body of the drone */}
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    {/* Arms connecting to propellers */}
    <line x1="50" y1="50" x2="20" y2="20" stroke="currentColor" strokeWidth="4" />
    <line x1="50" y1="50" x2="80" y2="20" stroke="currentColor" strokeWidth="4" />
    <line x1="50" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="4" />
    <line x1="50" y1="50" x2="80" y2="80" stroke="currentColor" strokeWidth="4" />
    {/* Propellers */}
    <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="80" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="20" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="80" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
  </svg>
);



function DroneAnimation() {
  
  const [speed, setSpeed] = useState(10);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white font-sans p-4">
      
      <h1 className="text-4xl font-bold mb-2">Drone Fly-By</h1>
      <p className="text-gray-400 mb-8">Adjust the slider to change the drone speed.</p>
      
      {/* The container for the animation */}
      <div className="sky">
        {/* Drone 1 */}
        <div 
          className="drone" 
          style={{ 
            animationDuration: `${speed}s`, 
            top: '20%' 
          }}
        >
          <DroneIcon />
        </div>
        
        {/* Drone 2 */}
        <div 
          className="drone" 
          style={{ 
            animationDuration: `${speed}s`, 
            top: '60%', 
            animationDelay: `${speed / 3}s` 
          }}
        >
          <DroneIcon style={{ transform: 'scaleX(-1)' }} /> {/* Flip this one */}
        </div>
      </div>

      {/* Controls for the animation speed */}
      <div className="controls">
        <label htmlFor="speedControl">Speed: {speed} seconds</label>
        <input
          id="speedControl"
          type="range"
          min="3"  
          max="20" 
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className="speed-slider"
        />
      </div>
    </div>
  );
}

export default DroneAnimation;