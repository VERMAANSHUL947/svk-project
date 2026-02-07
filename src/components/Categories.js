'use client';
import Link from 'next/link';
import './Categories.css';

const categories = [
  {
    icon: '❄️',
    title: 'AC, Appliance & Electronics Repair',
    link: '/appliance',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
  },
  {
    icon: '🛠️',
    title: 'Electrician, Plumber & Cleaning',
    link: '/plumber',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
  },
  {
    icon: '🛡️',
    title: 'Expert Safety, Pest Control & Security',
    link: '/plumber',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    icon: '💆‍♀️',
    title: "Women's Beauty & Spa",
    link: '/appliance',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
  },
  {
    icon: '💈',
    title: "Men's Grooming",
    link: '/plumber',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop'
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Child & Elder Care',
    link: '/electrician',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=300&fit=crop'
  },
  {
    icon: '🪚',
    title: 'Carpenter, Painter & Renovation',
    link: '/ac-repair',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop'
  },
  {
    icon: '☀️',
    title: 'Solar Expert, Borewell & Water Pump Expert',
    link: '/ac-repair',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
  },
  {
    icon: '🚚',
    title: 'Logistics, Travel & Manpower',
    link: '/appliance',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
  },
];

export default function Categories() {
  return (
    <section className="categories">
      <div className="categories-container">

        <div className="categories-header">
          <h2>What are you looking for?</h2>
        </div>

        <div className="categories-grid">
          {categories.map((item, index) => (
            <Link href={item.link} key={index} className="category-link">
              <div className="category-card">
                <div className="category-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="category-icon">{item.icon}</div>
                <p>{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
