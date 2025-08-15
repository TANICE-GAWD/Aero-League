import React, { useRef, useEffect, useState } from 'react';
import './AeroLeague.css';

const Animation = () => {
  const containerRef = useRef(null);
  const splineRef = useRef(null);
  const [showSpline, setShowSpline] = useState(false);

  // Lazy-load the spline viewer when the section enters the viewport
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
    if (!showSpline) return;
    // The logo is inside a shadow DOM, so we need to access it this way.
    // We wait for the component to mount before trying to find the logo.
    if (splineRef.current) {
      const splineViewer = splineRef.current;
      
      // Function to find and hide the logo
      const findAndHideLogo = () => {
        const shadowRoot = splineViewer.shadowRoot;
        if (shadowRoot) {
          const logo = shadowRoot.getElementById('logo');
          if (logo) {
            logo.style.display = 'none';
          }
        }
      };

      // The viewer might take a moment to initialize and create the shadow DOM.
      // We'll check for it immediately and then set up a small interval to check again
      // just in case it wasn't ready right away.
      findAndHideLogo();
      const interval = setInterval(findAndHideLogo, 100);

      // Clean up the interval after 2 seconds or when the component unmounts
      const timeout = setTimeout(() => clearInterval(interval), 2000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [showSpline]); // The empty array ensures this effect runs only once.

  return (
    <section ref={containerRef} className="animation-section">
      {showSpline && (
        <spline-viewer
          ref={splineRef}
          url="https://prod.spline.design/BpEFbgTw5ogZjSJJ/scene.splinecode"
          no-zoom
        ></spline-viewer>
      )}
    </section>
  );
};

export default Animation;

