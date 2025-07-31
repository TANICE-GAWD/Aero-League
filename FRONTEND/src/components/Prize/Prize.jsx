import './Prize.css'

export default function RewardsSection() {
  const rewards = [
    { place: "3rd", image: "/assets/THIRD.png", details: "Bronze Medal + Swag Pack" },
    { place: "1st", image: "/assets/FIRST.png", details: "Gold Trophy + Cash Prize" },
    { place: "2nd", image: "/assets/SECOND.png", details: "Silver Medal + Tech Gear" },
  ];

  return (
    <section className="rewards-section">
      <div className="rewards-container">
        <h2 className="rewards-title">What You Can Win</h2>
        <div className="rewards-grid">
          {rewards.map((reward, index) => (
            <div key={index} className="reward-card-group">
              <div className="reward-card">
                <div className="card-front">
                  <img
                    src={reward.image}
                    alt={`${reward.place} Place Trophy`}
                    className="reward-image"
                  />
                </div>
                <div className="card-back">
                  <p className="reward-details-title">What You Get</p>
                  <p className="reward-details">{reward.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
