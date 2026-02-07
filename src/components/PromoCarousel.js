'use client';
import { useState, useEffect } from 'react';
import './PromoCarousel.css';

export default function PromoCarousel() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(`/api/banners?t=${Date.now()}`);
                const data = await res.json();
                if (data.success && data.banners.length > 0) {
                    setBanners(data.banners);
                }
            } catch (e) {
                console.error('Banner fetch failed:', e);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    return (
        <section className="promo-carousel-section">
            <div className="promo-carousel-container">
                <div className="promo-banner-large">
                    <img
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title}
                        className="promo-bg-image"
                        key={currentIndex}
                    />
                    <div className="promo-overlay"></div>

                    {currentBanner.badge && <div className="promo-badge-flash">{currentBanner.badge}</div>}

                    <div className="promo-content-large">
                        <h2 className="promo-main-title">{currentBanner.title}</h2>
                        <h3 className="promo-sub-title">{currentBanner.subtitle || currentBanner.linkToCategory || 'Exclusive Offer'}</h3>

                        <div className="promo-footer">
                            <div className="promo-price-tag">
                                {currentBanner.price ? `Starts at ₹${currentBanner.price}` : 'Book Expert Service'}
                            </div>

                            <div className="promo-dots">
                                {banners.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`promo-dot ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
