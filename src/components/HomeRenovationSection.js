'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import './HomeRenovationSection.css';

const staticServices = [];

export default function HomeRenovationSection() {
    const [dynamicSubCats, setDynamicSubCats] = useState([]);
    const [selectedSubCat, setSelectedSubCat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchRenovationCats = async () => {
            try {
                const res = await fetch('/api/categories?all=true&t=' + Date.now());
                const data = await res.json();
                if (data.success && data.categories) {
                    const parent = data.categories.find(c => {
                        const name = c.name?.toLowerCase() || '';
                        return name.includes('home renovation') || name.includes('renovation');
                    });
                    if (parent && parent.children && parent.children.length > 0) {
                        // Filter out inactive categories and services
                        const activeChildren = parent.children
                            .filter(sub => sub.status === 'Active')
                            .map(sub => ({
                                ...sub,
                                children: sub.children ? sub.children.filter(service => service.status === 'Active') : []
                            }));
                        setDynamicSubCats(activeChildren);
                    }
                }
            } catch (e) {
                console.error('Home renovation fetch error:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRenovationCats();
    }, []);

    const handleSubCatClick = (sub) => {
        setSelectedSubCat(sub);
    };

    const handleAddToCart = (service) => {
        const item = {
            id: service._id,
            name: service.name,
            price: Number(service.price) || 0,
            image: service.icon?.startsWith('http') ? service.icon : (selectedSubCat.image || null),
            category: selectedSubCat?.name
        };
        addToCart(item);
        toast.success(`${service.name} added to cart!`, { position: "bottom-center", autoClose: 2000 });
    };

    const getIcon = (icon) => {
        if (!icon) return '🏠';
        if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:'))) {
            return <img src={icon} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
        }
        return icon;
    };

    const displayCats = dynamicSubCats;

    return (
        <section className="home-renovation-section">
            <div className="home-renovation-container">
                <h2 className="section-title">Home Renovation</h2>
                <div className="home-renovation-grid">
                    {displayCats.map((sub) => (
                        <div
                            key={sub._id}
                            className="renovation-card"
                            onClick={() => handleSubCatClick(sub)}
                        >
                            <div className="renovation-image">
                                <img src={sub.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'} alt={sub.name} />
                            </div>
                            <div className="renovation-icon">
                                {getIcon(sub.icon)}
                            </div>
                            <p>{sub.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subcategories Modal (Shows Level 2 Services) */}
            {selectedSubCat && (
                <div className="subcategory-modal-overlay" onClick={() => setSelectedSubCat(null)}>
                    <div className="subcategory-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <span className="modal-icon">{getIcon(selectedSubCat.icon)}</span>
                                {selectedSubCat.name}
                            </h3>
                            <button className="close-btn" onClick={() => setSelectedSubCat(null)}>✕</button>
                        </div>
                        <div className="modal-content">
                            <p className="modal-subtitle">Select a service:</p>
                            <div className="subcategory-list">
                                {selectedSubCat.children && selectedSubCat.children.length > 0 ? (
                                    selectedSubCat.children.map((service) => (
                                        <div
                                            key={service._id}
                                            className="subcategory-item"
                                            onClick={() => handleAddToCart(service)}
                                        >
                                            <div className="service-info-main">
                                                <div className="service-icon-wrapper">
                                                    {getIcon(service.icon)}
                                                </div>
                                                <div>
                                                    <div className="subcategory-name">{service.name}</div>
                                                    <div className="service-price">
                                                        Starts at ₹{service.price}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-action-btn">ADD</div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No specific services added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
