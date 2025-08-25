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
    if (!showSpline || !splineRef.current) return;

    const splineViewer = splineRef.current;

    const hideLogo = () => {
      const shadowRoot = splineViewer.shadowRoot;
      if (!shadowRoot) return;

      const logo = shadowRoot.getElementById('logo');
      if (logo) {
        logo.style.display = 'none';
      }
    };

    // Try immediately in case shadowRoot is already ready
    hideLogo();

    // Listen for Spline load event → ensures watermark is hidden first load
    const handleLoad = () => {
      hideLogo();
    };

    splineViewer.addEventListener('load', handleLoad);

    // Fallback: interval check for ~2s (in case shadowRoot initializes late)
    const interval = setInterval(hideLogo, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      splineViewer.removeEventListener('load', handleLoad);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showSpline]);

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
