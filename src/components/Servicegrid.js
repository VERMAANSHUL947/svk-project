'use client';
import { MapPin } from 'lucide-react';
import './ServicesGrid.css'
const services = [
  { id: 1, name: 'Electrician', category: 'Electrical', price: 250, rating: 4.9, reviews: 127, location: 'Ghaziabad', verified: true, responseTime: '15 mins' },
  { id: 2, name: 'Plumber', category: 'Plumbing', price: 180, rating: 4.7, reviews: 89, location: 'Noida', verified: true, responseTime: '20 mins' },
  // ... more services
];

export default function Servicegrid({ searchTerm, selectedCategory, selectedLocation }) {
  const filteredServices = services.filter(service => 
    (searchTerm === '' || service.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || service.category === selectedCategory) &&
    (selectedLocation === 'All' || service.location === selectedLocation)
  );

  return (
    <section className="services-section">
      <div className="container">
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card">
              {/* Service card content */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}