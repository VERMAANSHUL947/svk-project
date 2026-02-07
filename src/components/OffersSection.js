'use client';
import { useState, useEffect, useRef } from 'react';
import './OffersSection.css';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

const offers = [];

export default function OffersSection() {
    const { addToCart } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [dynamicBanners, setDynamicBanners] = useState([]);
    const carouselRef = useRef(null);
    const [itemsVisible, setItemsVisible] = useState(3);

    // Responsive Carousel Logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 640) setItemsVisible(1);
            else if (window.innerWidth <= 968) setItemsVisible(2);
            else setItemsVisible(3);
        };
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch dynamic banners from backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(`/api/banners?t=${Date.now()}`);
                const data = await res.json();
                if (data.success && data.banners) {
                    console.log(`✅ Loaded ${data.banners.length} banners in OffersSection`);
                    // Map all banners to UI format
                    const formatted = data.banners.map(b => ({
                        id: b._id,
                        name: b.title,
                        title: b.title,
                        subtitle: b.subtitle || (b.linkToCategory ? `Special for ${b.linkToCategory}` : 'Exclusive Offer'),
                        buttonText: 'Book Now →',
                        bgColor: b.bgColor || '#F3E5F5',
                        textColor: b.textColor || '#7B1FA2',
                        image: b.imageUrl,
                        price: b.price != null ? Number(b.price) : 0,
                        badge: b.badge || 'NEW OFFER'
                    }));
                    if (formatted.length > 0) console.log('💰 Sample Banner Price:', formatted[0].price);
                    setDynamicBanners(formatted);
                }
            } catch (error) {
                console.error('Banner fetch error:', error);
            }
        };
        fetchBanners();
    }, []);

    const activeOffers = dynamicBanners;

    // Auto-slide effect
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying, activeOffers]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= activeOffers.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? activeOffers.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const handleAddToCart = (offer) => {
        addToCart({
            id: offer.id,
            name: offer.name,
            price: offer.price,
            image: offer.image
        });
        toast.success(`${offer.name} added to cart!`, {
            position: "bottom-right",
            autoClose: 2000,
        });
    };

    return (
        <section className="offers-section">
            <div className="offers-container">
                <h2 className="offers-title">Exclusive Offers</h2>

                <div
                    className="carousel-wrapper"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Previous Button */}
                    <button className="carousel-nav prev" onClick={prevSlide}>
                        <ChevronLeft size={24} />
                    </button>

                    {/* Carousel Track */}
                    <div className="carousel-track" ref={carouselRef}>
                        <div
                            className="carousel-inner"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsVisible)}%)`,
                                transition: 'transform 0.5s ease-in-out'
                            }}
                        >
                            {activeOffers.map((offer, index) => (
                                <div
                                    key={index}
                                    className="offer-card"
                                    style={{ backgroundColor: offer.bgColor }}
                                >
                                    {offer.badge && (
                                        <div className="offer-badge">{offer.badge}</div>
                                    )}
                                    <div className="offer-image">
                                        <img src={offer.image} alt={offer.title} />
                                    </div>
                                    <div className="offer-content">
                                        <h3 style={{ color: offer.textColor }}>{offer.title}</h3>
                                        <p>{offer.subtitle}</p>
                                        <p className="offer-price">
                                            ₹{offer.price || 0}
                                        </p>
                                        <div className="offer-actions">
                                            <button
                                                className="offer-button"
                                                style={{
                                                    backgroundColor: offer.textColor,
                                                    color: '#fff'
                                                }}
                                            >
                                                {offer.buttonText}
                                            </button>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(offer)}
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Button */}
                    <button className="carousel-nav next" onClick={nextSlide}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="carousel-dots">
                    {activeOffers.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
