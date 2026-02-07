'use client';
import './ServicesCategory.css';
import { useRouter } from 'next/navigation';

const data = [
  {
    title: 'Beauty, Grooming & Wellness',
    icon: '👩',
    iconBg: '#fde7ef',
    route: '/appliance',
    items: [
      "Women's Salon",
      'Spa',
      'Bridal & Party Makeup',
      "Men's Haircut",
      'Beard Grooming & Styling'
    ]
  },
  {
    title: 'AC Repair & Appliance Services',
    icon: '❄️',
    iconBg: '#e6f4ff',
    route: '/ac-repair',
    items: [
      'AC',
      'Washing Machine',
      'Refrigerator / Fridge',
      'Air Cooler',
      'RO / Water Purifier'
    ]
  },
  {
    title: 'Home Cleaning & Hygiene',
    icon: '🧹',
    iconBg: '#eaf7ef',
    route: '/appliance',
    items: [
      'Full Home Deep Cleaning',
      'Bathroom Cleaning',
      'Kitchen Cleaning',
      'Sofa Cleaning',
      'Carpet Cleaning'
    ]
  },
  {
    title: 'Plumber & Electrician Services',
    icon: '🛠️',
    iconBg: '#fff4e5',
    route: '/plumber',   // 👈 route added
    items: [
      'Plumber',
      'Electrician',
      'Tap & Pipe Repair',
      'Wiring & Switch Repair',
      'Water Motor Installation'
    ]
  }
];

export default function ServicesCategory() {
  const router = useRouter();

  return (
    <section className="service-section">
      <div className="service-wrapper">
        {data.map((cat, i) => (
          <div
            className="service-row"
            key={i}
            onClick={() => cat.route && router.push(cat.route)}
            style={{ cursor: cat.route ? 'pointer' : 'default' }}
          >
            <div className="service-header">
              <div
                className="service-icon"
                style={{ backgroundColor: cat.iconBg }}
              >
                {cat.icon}
              </div>
              <h3>{cat.title}</h3>
            </div>

            <div className="service-tags">
              {cat.items.map((item, idx) => (
                <span key={idx} className="service-pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
