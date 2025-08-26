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
        <p>5th & 6th SEPTEMBER 2025 | 10 am Onwards</p>
        <button className="learn-more-btn" onClick={() => window.open('https://tanice-gawd.github.io/tal-doc/', '_blank')}>Learn More</button>
      </div>
    </div>
  )
}

export default AeroLeagueLayout
