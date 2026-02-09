'use client';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

export default function DynamicSectionRenderer({ sections }) {
    const { addToCart } = useCart();

    const handleAddToCart = (service, sectionTitle) => {
        addToCart({
            id: service._id || Math.random().toString(36).substr(2, 9),
            name: service.name,
            price: service.price,
            image: service.image,
            category: sectionTitle
        });
        toast.success(`${service.name} added!`);
    };

    if (!sections || sections.length === 0) return null;

    return (
        <>
            <style jsx>{`
                .dynamic-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }

                @media (max-width: 640px) {
                    .dynamic-section {
                        padding: 24px 0 !important;
                    }

                    .dynamic-section .container {
                        padding: 0 !important;
                    }

                    .dynamic-section .section-title {
                        padding: 0 12px !important;
                    }

                    .dynamic-grid {
                        display: flex !important;
                        overflow-x: auto;
                        overflow-y: hidden;
                        gap: 12px !important;
                        grid-template-columns: unset !important;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        padding: 0 12px;
                    }

                    .dynamic-grid::-webkit-scrollbar {
                        display: none;
                    }

                    .dynamic-card {
                        flex: 0 0 260px !important;
                        min-width: 260px !important;
                    }
                }
            `}</style>
            <div className="dynamic-sections-wrapper" style={{ background: '#fff', paddingBottom: '40px' }}>
                {sections.map(section => (
                    <section key={section._id} className="dynamic-section" style={{ padding: '40px 20px' }}>
                        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <h2 className="section-title" style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: '#111827',
                                marginBottom: '1.5rem',
                                textAlign: 'left',
                                letterSpacing: '-0.025em'
                            }}>
                                {section.title}
                            </h2>
                            <div className="dynamic-grid">
                                {section.services.map((service, idx) => (
                                    <div key={idx} className="dynamic-card" style={{
                                        background: '#F5F3FF', // Light purple background
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                                        transition: 'transform 0.3s ease',
                                        border: '1px solid #EDE9FE',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {/* Image Container */}
                                        <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                            <img
                                                src={service.image || 'https://via.placeholder.com/300'}
                                                alt={service.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {service.badge && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    background: '#FF5A5A',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    boxShadow: '0 4px 10px rgba(255, 90, 90, 0.3)'
                                                }}>
                                                    {service.badge}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '700',
                                                marginBottom: '0.4rem',
                                                color: '#6B21A8', // Dark purple title
                                                textTransform: 'capitalize'
                                            }}>
                                                {service.name}
                                            </h3>
                                            <p style={{
                                                color: '#6B7280',
                                                fontSize: '0.9rem',
                                                marginBottom: '1.25rem',
                                                lineHeight: '1.5',
                                                fontWeight: '500'
                                            }}>
                                                {service.description || 'Professional service by verified experts'}
                                            </p>

                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827' }}>
                                                    ₹{service.price}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => handleAddToCart(service, section.title)}
                                                    style={{
                                                        flex: 1,
                                                        background: '#7E22CE', // Vibrant purple
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '12px 20px',
                                                        borderRadius: '10px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        fontSize: '0.95rem',
                                                        transition: 'all 0.2s ease',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    Book Now →
                                                </button>

                                                <button
                                                    onClick={() => handleAddToCart(service, section.title)}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        background: 'white',
                                                        color: '#10B981', // Emerald green
                                                        border: '2px solid #10B981',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}
