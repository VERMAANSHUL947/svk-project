'use client';
import { useState, useEffect } from 'react';
import './EssentialServicesSection.css';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

export default function EssentialServicesSection() {
    const [services, setServices] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/categories?isEssential=true');
                const data = await res.json();
                if (data.success) {
                    setServices(data.categories);
                }
            } catch (error) {
                console.error("Failed to fetch essential services", error);
            }
        };

        fetchServices();
    }, []);

    const handleAddToCart = (service) => {
        addToCart({
            id: service._id,
            name: service.name,
            price: service.price,
            image: service.image || '/images/default-service.jpg'
        });
        toast.success(`${service.name} added to cart!`, {
            position: "bottom-right",
            autoClose: 2000,
        });
    };

    if (services.length === 0) return null; // Don't show if no featured services

    return (
        <section className="essential-services-section">
            <div className="essential-services-container">
                <h2 className="section-title">Essential Services</h2>
                <div className="essential-services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="essential-card">
                            <div className="essential-image">
                                <img src={service.image || '/images/default-service.jpg'} alt={service.name} />
                            </div>
                            <div
                                className="essential-icon"
                                style={{ backgroundColor: '#E3F2FD' }} // Default since iconBg isn't in model yet
                            >
                                {service.icon || '🛠️'}
                            </div>
                            <h3>{service.name}</h3>
                            <p>{service.details && service.details[0] ? service.details[0] : 'Professional Service'}</p>
                            <p className="essential-price">₹{service.price}</p>
                            <button className="essential-cart-btn" onClick={() => handleAddToCart(service)}>
                                <ShoppingCart size={16} /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
