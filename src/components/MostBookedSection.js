'use client';
import { useState, useEffect } from 'react';
import './MostBookedSection.css';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

export default function MostBookedSection() {
    const [services, setServices] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/categories?isMostBooked=true');
                const data = await res.json();
                if (data.success) {
                    setServices(data.categories);
                }
            } catch (error) {
                console.error("Failed to fetch most booked services", error);
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

    if (services.length === 0) return null;

    return (
        <section className="most-booked-section">
            <div className="most-booked-container">
                <div className="most-booked-header">
                    <h2 className="section-title">Most Booked Services</h2>
                    <a href="/services" className="view-all">View All</a>
                </div>
                <div className="most-booked-scroll">
                    {services.map((service, index) => (
                        <div key={index} className="booked-card">
                            <div className="booked-image">
                                <img src={service.image || '/images/default-service.jpg'} alt={service.name} />
                            </div>
                            <div className="booked-content">
                                <h3>{service.name}</h3>
                                <p className="price-range">Starts at ₹{service.price}</p>
                                <button className="add-to-cart" onClick={() => handleAddToCart(service)}>
                                    <ShoppingCart size={16} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
