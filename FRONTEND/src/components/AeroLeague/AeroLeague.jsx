import React, { useRef, useEffect, useState } from 'react';
import './AeroLeague.css';

const AeroLeagueLayout = () => {
  const containerRef = useRef(null);
  const splineRef = useRef(null);
  const [showSpline, setShowSpline] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSpline(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  
  useEffect(() => {
    if (!showSpline || !splineRef.current) return;

    const splineViewer = splineRef.current;
    let intervalId = null;

    const onSplineReady = () => {
      // Prevent this from running multiple times
      if (splineViewer.hasAttribute('data-ready')) return;
      splineViewer.setAttribute('data-ready', 'true');

      setIsSplineLoaded(true); // This hides the loader
      clearInterval(intervalId); 

      const tryInjectingStyle = (retries = 15, interval = 100) => {
        const shadowRoot = splineViewer.shadowRoot;
        
        if (shadowRoot) {

          const style = document.createElement('style');
          style.innerHTML = `#logo { display: none !important; }`;
          shadowRoot.appendChild(style);
          return; // Success!
        }


        if (retries > 0) {
          setTimeout(() => tryInjectingStyle(retries - 1, interval), interval);
        }
      };
      
      // Start the process of trying to hide the logo.
      tryInjectingStyle();
    };

    // Method 1: Listen for the official 'load' event
    splineViewer.addEventListener('load', onSplineReady);

    // Method 2: Fallback poller that checks if the canvas has been rendered
    intervalId = setInterval(() => {
      if (splineViewer.shadowRoot && splineViewer.shadowRoot.querySelector('canvas')) {
        onSplineReady();
      }
    }, 200);

    // Cleanup function
    return () => {
      splineViewer.removeEventListener('load', onSplineReady);
      clearInterval(intervalId);
    };
  }, [showSpline]);

  return (
    <section ref={containerRef} className="aero-league-section">
      <div className="top-container">
        <div className="animation-wrapper">
          <div className="animation-panel">
            {showSpline && !isSplineLoaded && <div className="loader-butterfly"></div>}

            {showSpline && (
              <spline-viewer
                ref={splineRef}
                url="https://prod.spline.design/BpEFbgTw5ogZjSJJ/scene.splinecode"
              ></spline-viewer>
            )}
          </div>
          <h3 className="tagline">BUILD. FLY. DOMINATE.</h3>
          
        </div>

        <div className="content-panel">
          <div className="text-content">
            <h2>
              A New Era of <span className="highlight-text">Racing</span>
            </h2>
            <p>
              Explore the cutting-edge technology behind the Thapar Drone Challenge. Witness
              how 3D modeling and precision engineering come together to create
              the next generation of competitive drones.

              
              <p>
            Join us on 5-6 September, 2025 10:00 AM onwards.
          </p>
            </p>
            <button onClick={() => window.open('https://tanice-gawd.github.io/tal-doc/', '_blank')} className="learn-more-btn">Learn More</button>
          </div>
          <div className="image-panel">
            <img src="./assets/drone.webp" alt="Drone in flight" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AeroLeagueLayout;