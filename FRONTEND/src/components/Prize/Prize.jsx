import "./Prize.css";
import { GiDeliveryDrone } from "react-icons/gi";


// 1st place 25000
// 2nd 12000
// consolation 5000
// backup 5000


export default function PrizesSection() {
  const rewardsData = [
    { place: "3rd", image: "/assets/THIRD.png", details: "INR 5,000", tier: "bronze" },
    { place: "1st", image: "/assets/FIRST.png", details: "INR 25,000", tier: "gold" },
    { place: "2nd", image: "/assets/SECOND.png", details: "INR 12,000", tier: "silver" },
  ];

  // Sort rewards to ensure a 1st, 2nd, 3rd podium layout
  const sortedRewards = rewardsData.sort((a, b) => {
    const order = { gold: 1, silver: 2, bronze: 3 };
    return order[a.tier] - order[b.tier];
  });

  return (
    <section className="team-section">
      <div className="prizes-container">
        <h2 className="prizes-title">CHAMPION'S REWARDS</h2>
        <div className="prizes-grid">
          {sortedRewards.map((reward) => (
            // The tier class allows for unique styling (gold, silver, bronze)
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
              {/* ✨ NEW: Thematic drone icon for hover interaction */}
              <div className="drone-icon">
                <GiDeliveryDrone />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}