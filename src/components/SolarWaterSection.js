'use client';
import './SolarWaterSection.css';

const services = [
    {
        icon: '☀️',
        title: 'Solar Panels',
        subtitle: 'Installation & Maintenance',
        iconBg: '#E3F2FD',
        iconColor: '#1976D2',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'
    },
    {
        icon: '🔆',
        title: 'Solar Water Heaters',
        subtitle: 'Eco-friendly heating systems',
        iconBg: '#FFF3E0',
        iconColor: '#F57C00',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'
    },
    {
        icon: '💧',
        title: 'Borewell & Water Pumps',
        subtitle: 'Pumping & drilling services',
        iconBg: '#E3F2FD',
        iconColor: '#1976D2',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop'
    }
];

export default function SolarWaterSection() {
    return (
        <section className="solar-water-section">
            <div className="solar-water-container">
                <h2 className="section-title">Solar & Water Solutions</h2>
                <div className="solar-water-grid">
                    {services.map((service, index) => (
                        <div key={index} className="solar-water-card">
                            <div className="solar-image">
                                <img src={service.image} alt={service.title} />
                            </div>
                            <div
                                className="solar-icon"
                                style={{ backgroundColor: service.iconBg, color: service.iconColor }}
                            >
                                {service.icon}
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
