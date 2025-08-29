import './AeroLeague.css'

function AeroLeagueLayout() {
  return (
    <div className="aero-container">
      <img src='/assets/drone/1.png' className='aero-drone-image-1' alt='Drone 1' />
      <img src='/assets/drone/2.png' className='aero-drone-image-2' alt='Drone 2' />
      <div className="aero-header">
        <h1>THAPAR DRONE</h1>
        <h2>CHALLENGE</h2>
      </div>

      <h3 className="aero-subtitle">
        <span className='aero-build'>BUILD.</span>
        <span className='aero-fly'>FLY.</span>
        <span className='aero-dominate'>DOMINATE.</span></h3>

      <div className="aero-info">
        <p>6th & 7th SEPTEMBER 2025 | 10 am Onwards</p>
        <button className="learn-more-btn" onClick={() => window.open('https://tanice-gawd.github.io/tal-doc/', '_blank')}>Learn More</button>
      </div>
      <div className="aero-footer">
        <p className="aero-footer-description">
          The Thapar Drone Challenge 2025 is a premier event, initiated by <strong>CSED, Thapar Institute</strong>, designed to bring together the most innovative minds in engineering and technology.
        </p>
        <p className="aero-footer-description">
          This high-stakes competition challenges participants to design, build, and fly their own drones, pushing the limits of aerial robotics and fostering a spirit of hands-on innovation.
        </p>
        <p className="aero-footer-description">
          Participants will tackle real-world scenarios, creating robust solutions that could shape the future of drone technology and its applications across various industries.
        </p>
      </div>
    </div>
  )
}

export default AeroLeagueLayout
