import React, { useRef, useEffect } from 'react';
import './AeroLeague.css';

const Animation = () => {
  const splineRef = useRef(null);

  useEffect(() => {
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
  }, []); // The empty array ensures this effect runs only once.

  return (
    <section className="animation-section">
      <spline-viewer
        ref={splineRef}
        url="https://prod.spline.design/BpEFbgTw5ogZjSJJ/scene.splinecode"
        no-zoom /* This attribute disables scroll-to-zoom */
      ></spline-viewer>
    </section>
  );
};

export default Animation;

