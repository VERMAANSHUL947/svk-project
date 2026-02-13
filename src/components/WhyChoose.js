'use client';
import './WhyChoose.css';

const stats = [
  {
    value: '100%',
    label: 'VERIFIED PROS',
    color: '#7b3ff2'
  },
  {
    value: '24/7',
    label: 'SUPPORT',
    color: '#0066cc'
  },
  {
    value: '1M+',
    label: 'SERVICE DONE',
    color: '#ff6600'
  },
  {
    value: '4.9',
    label: 'APP RATING',
    color: '#7b3ff2'
  }
];

// Duplicate stats for seamless marquee
const extendedStats = [...stats, ...stats, ...stats];

export default function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="why-container">
        <h2 className="why-title">Why trust our services?</h2>
        <div className="marquee-wrapper">
          <div className="stats-track">
            {extendedStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3 style={{ color: stat.color }}>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
