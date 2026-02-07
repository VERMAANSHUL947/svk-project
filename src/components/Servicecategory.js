'use client';
import './ServicesCategory.css';
import { useRouter } from 'next/navigation';

const data = [
  {
    title: 'Beauty, Grooming & Wellness',
    icon: '👩',
    slug: 'beauty',
    items: [
      "women-salon",
      'spa',
      'bridal-makeup',
      "mens-haircut",
      'beard-grooming'
    ]
  },
  {
    title: 'AC Repair & Appliance Services',
    icon: '❄️',
    slug: 'ac-repair',
    items: [
      'ac',
      'washing-machine',
      'refrigerator',
      'air-cooler',
      'ro-service'
    ]
  },
  {
    title: 'Home Cleaning & Hygiene',
    icon: '🧹',
    slug: 'home-cleaning',
    items: [
      'full-home-cleaning',
      'bathroom-cleaning',
      'kitchen-cleaning',
      'sofa-cleaning',
      'carpet-cleaning'
    ]
  },
  {
    title: 'Electrician',
    icon: '⚡',
    slug: 'electrician',
    items: [
      'switch-repair',
      'fan-installation',
      'wiring-work',
      'light-installation',
      'inverter-repair'
    ]
  },
  {
    title: 'Plumber',
    icon: '🔧',
    slug: 'plumber',
    items: [
      'tap-repair',
      'flush-repair',
      'pipe-leakage',
      'drainage-cleaning',
      'tile-grouting'
    ]
  }
];

export default function Servicecategory() {
  const router = useRouter();

  return (
    <section className="service-section">
      <div className="service-container">
        {data.map((cat, i) => (
          <div className="service-card" key={i}>
            
            {/* 🔹 CATEGORY NAVIGATION */}
            <div
              className="service-header clickable"
              onClick={() => router.push(`/services/${cat.slug}`)}
            >
              <div className="service-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
            </div>

            <div className="service-tags">
              {cat.items.map((item, idx) => (
                <button
                  key={idx}
                  className="service-tag"
                  onClick={() =>
                    router.push(`/services/${cat.slug}/${item}`)
                  }
                >
                  {item.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
