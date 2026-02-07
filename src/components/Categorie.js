'use client';
import './Categories.css';

const categorie = [
  { icon: '❄️', title: 'AC, Appliance & Electronics Repair' },
  { icon: '🛠️', title: 'Electrician, Plumber & Cleaning' },
  { icon: '🛡️', title: 'Expert Safety, Pest Control & Security' },
  { icon: '💆‍♀️', title: "Women's Beauty & Spa" },
  { icon: '💈', title: "Men's Grooming" },
  { icon: '👨‍👩‍👧', title: 'Child & Elder Care' },
  { icon: '🪚', title: 'Carpenter, Painter & Renovation' },
  { icon: '☀️', title: 'Solar Expert, Borewell & Water Pump Expert' },
  { icon: '🚚', title: 'Logistics, Travel & Manpower' },
];

export default function Categorie() {
  return (
    <section className="categories">
      <div className="categories-container">

        <div className="categories-header">
          <h2>What are you looking for?</h2>
          
        </div>

        <div className="categories-grid">
          {categorie.map((item, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">{item.icon}</div>
              <p>{item.title}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
