'use client';
import './Hero.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { categories } from '../data/categories';
import {
  ACIcon,
  ElectricianIcon,
  PaintingIcon,
  HomeIcon,
  ToolsIcon,
  ApplianceIcon,
  BeautyIcon,
  GroomingIcon,
  SecurityIcon
} from './ServiceIcons';

export default function Hero() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // --- CART ---
  const { addToCart, cart } = useCart();

  // --- DYNAMIC CATEGORIES ---
  const [dynamicCats, setDynamicCats] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories?all=true&t=' + Date.now());
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          // Filter out Home Renovation from Hero as it has its own dedicated section
          const filteredCats = data.categories.filter(c => {
            const name = c.name?.toLowerCase() || '';
            // Exclude renovation, but keep everything else
            return !name.includes('renovation');
          });
          setDynamicCats(filteredCats);
        }
      } catch (e) {
        console.error('Hero categories fetch failed:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`/api/banners?t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch (e) {
        console.error('Hero banner fetch failed:', e);
      }
    };
    fetchBanners();
  }, []);

  // Banner rotation logic
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  useEffect(() => {
    const checkLocalUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
      }
    };

    checkLocalUser();

    window.addEventListener('user-login', checkLocalUser);
    window.addEventListener('user-updated', checkLocalUser);
    return () => {
      window.removeEventListener('user-login', checkLocalUser);
      window.removeEventListener('user-updated', checkLocalUser);
    };
  }, []);

  const handleCategoryClick = (cat) => {
    setSelectedParent(cat);
    setSelectedSub(null);
  };

  const handleAddToCart = (service) => {
    // Convert DB service object to Cart item format
    const item = {
      id: service._id,
      name: service.name,
      price: Number(service.price) || 0,
      image: service.icon?.startsWith('http') ? service.icon : null,
      category: selectedSub?.name
    };

    addToCart(item);
    toast.success(`${service.name} added to cart!`, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });
  };

  const getIcon = (icon) => {
    if (!icon) return '📁';
    if (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:')) {
      return <img src={icon} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    }
    return icon;
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <h1 className="hero-title">
          {user ? `Welcome back, ${user.fullName.split(' ')[0]}!` : "Home service experts at your doorstep"}
        </h1>
        {user && <p className="hero-welcome-sub" style={{ textAlign: 'center', color: '#64748b', marginTop: '-10px', fontSize: '18px', fontWeight: '500' }}>What can we help you with today?</p>}

        <div className="hero-wrapper">
          {/* LEFT SIDE - Promotional Banner */}
          <div className="hero-left">
            <div className="promo-banner">
              {banners.length > 0 ? (
                <div
                  className="promo-image"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (banners[currentBannerIndex].linkToCategory) {
                      // Basic routing logic for categories
                      const catMap = {
                        'Deep Cleaning': 'cleaning',
                        'Plumbing Checkup': 'electrician',
                        'Electrician Visit': 'electrician',
                        'AC Repair': 'ac'
                      };
                      const catKey = catMap[banners[currentBannerIndex].linkToCategory];
                      if (catKey) handleCategoryClick(catKey);
                    }
                  }}
                >
                  <img src={banners[currentBannerIndex].imageUrl} alt={banners[currentBannerIndex].title} key={currentBannerIndex} />
                  <div className="promo-badge">Flash Sale</div>
                  <div className="promo-text">
                    <h2>{banners[currentBannerIndex].title}</h2>
                    <p className="promo-subtitle">{banners[currentBannerIndex].linkToCategory || 'Special Offer'}</p>
                    <p className="promo-offer">
                      {banners[currentBannerIndex].price ? `Starts at ₹${banners[currentBannerIndex].price}` : 'Exclusive Partner Deal'}
                    </p>
                  </div>
                  {/* Dots Indicators */}
                  {banners.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '15px', right: '20px', display: 'flex', gap: '6px', zIndex: 10 }}>
                      {banners.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentBannerIndex(idx); }}
                          style={{
                            width: idx === currentBannerIndex ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: idx === currentBannerIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="promo-image">
                  <img src="/slider1.jpg" alt="Home Cleaning" />
                  <div className="promo-badge">Flash Sale</div>
                  <div className="promo-text">
                    <h2>HOME CLEANING</h2>
                    <p className="promo-subtitle">Natural</p>
                    <p className="promo-offer">Up to 40% OFF on Deep Cleaning</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bottom-grid">
              <div className="worker-image">
                <img src="/grid1-plumber.jpg" alt="Service Expert" />
              </div>
              <div className="service-illustration">
                <img src="/grid2-electrician.jpg" alt="Plumbing Services" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Service Categories */}
          <div className="hero-right">
            <div className="search-header">
              <span>What are you looking for?</span>
            </div>

            <div className="service-grid">
              {(dynamicCats.length > 0 ? dynamicCats : [
                { _id: '1', name: 'AC & App. Repair', icon: '❄️' },
                { _id: '2', name: 'Elec. & Plumber', icon: '⚡' },
                { _id: '3', name: 'Clean & Pest', icon: '🧹' },
                { _id: '4', name: 'Renovation', icon: '🏠' },
                { _id: '5', name: 'Fabrication', icon: '🏗️' },
                { _id: '6', name: 'Women Beauty', icon: '💄' },
                { _id: '7', name: 'Men Grooming', icon: '🧔' },
                { _id: '8', name: 'Home Care', icon: '👩‍⚕️' },
                { _id: '9', name: 'Security & Solar', icon: '🛡️' }
              ]).map((cat, idx) => (
                <div
                  className={`service-box ${selectedParent?._id === cat._id ? 'active' : ''}`}
                  key={cat._id || idx}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="service-icon">
                    {getIcon(cat.icon)}
                  </div>
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>

            {/* DYNAMIC CATEGORY MODAL */}
            {selectedParent && (
              <div className="modal-overlay" onClick={() => setSelectedParent(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: selectedSub ? '800px' : '650px' }}>
                  <button className="modal-close" onClick={() => setSelectedParent(null)}>×</button>

                  {!selectedSub ? (
                    <>
                      <h3>{selectedParent.name}</h3>
                      <div className="subcategory-grid">
                        {selectedParent.children && selectedParent.children.length > 0 ? (
                          selectedParent.children.map((sub) => (
                            <div
                              key={sub._id}
                              className="subcategory-card"
                              onClick={() => setSelectedSub(sub)}
                            >
                              <div className="subcategory-icon">{getIcon(sub.icon)}</div>
                              <p>{sub.name}</p>
                            </div>
                          ))
                        ) : (
                          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            No sub-categories added yet.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '30px' }}>
                      <button
                        onClick={() => setSelectedSub(null)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        ← Back to {selectedParent.name}
                      </button>
                      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '20px', textAlign: 'center' }}>{selectedSub.name}</h2>

                      <div className="services-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '50vh', overflowY: 'auto', padding: '10px' }}>
                        {selectedSub.children && selectedSub.children.length > 0 ? (
                          selectedSub.children.map(service => (
                            <div key={service._id} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '20px',
                              background: '#fff',
                              borderRadius: '16px',
                              border: '1px solid #E2E8F0',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                  <div style={{ width: 30, height: 30 }}>{getIcon(service.icon)}</div>
                                  <h4 style={{ margin: 0, fontSize: '18px', color: '#1E293B' }}>{service.name}</h4>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#059669', marginBottom: '10px' }}>Starts at ₹{service.price}</div>
                                <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '14px', color: '#64748B', listStyleType: 'disc' }}>
                                  {service.details?.map((detail, dIdx) => (
                                    <li key={dIdx} style={{ marginBottom: '4px' }}>{detail}</li>
                                  ))}
                                </ul>
                                <div style={{ marginTop: '12px', fontSize: '13px', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>View details</div>
                              </div>
                              <div style={{ textAlign: 'center', marginLeft: '20px' }}>
                                {service.icon?.startsWith('http') && (
                                  <img src={service.icon} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', marginBottom: '10px', display: 'block' }} />
                                )}
                                <button className="add-btn"
                                  onClick={() => handleAddToCart(service)}
                                  style={{
                                    background: '#fff',
                                    border: '1px solid #2563EB',
                                    color: '#2563EB',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseOver={(e) => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; }}
                                  onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2563EB'; }}
                                >
                                  Add
                                </button>
                                <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '5px' }}>{service.details?.length || 0} options</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ textAlign: 'center', color: '#64748B' }}>No specific services listed here yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STATS */}
            <div className="stats">
              <div className="stat-box">
                <h3>4.8★</h3>
                <p className="stat-label purple">SERVICE RATING</p>
              </div>
              <div className="stat-box">
                <h3>100K+</h3>
                <p className="stat-label blue">HAPPY CUSTOMERS</p>
              </div>
              <div className="stat-box">
                <h3>5K+</h3>
                <p className="stat-label orange">EXPERT PARTNERS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING VIEW CART BAR */}
      {cart.length > 0 && (
        <div className="cart-floating-bar" onClick={() => router.push('/cart')}>
          <div className="cart-bar-content">
            <div className="cart-bar-left">
              <div className="cart-bar-icon" style={{ position: 'relative' }}>
                <ShoppingCart size={24} />
                <span className="cart-bar-badge">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="cart-bar-text">
                <span className="cart-bar-total">₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                <span className="cart-bar-label">Added to cart</span>
              </div>
            </div>
            <div className="cart-bar-right">
              View Cart <ArrowRight size={20} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
