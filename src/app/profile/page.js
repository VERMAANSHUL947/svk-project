'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import OffersSection from '@/components/OffersSection';
import DynamicSectionRenderer from '@/components/DynamicSectionRenderer';
import SolarWaterSection from '@/components/SolarWaterSection';
import HomeRenovationSection from '@/components/HomeRenovationSection';
import EssentialServicesSection from '@/components/EssentialServicesSection';
import MostBookedSection from '@/components/MostBookedSection';
import ServiceBanners from '@/components/ServiceBanners';
import WhyChoose from '@/components/WhyChoose';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, User, LogOut, Package, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import './profile.css';
import '@/components/Hero.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('/api/sections?t=' + Date.now()).then(res => res.json()).then(data => {
      if (data.success) setSections(data.sections);
    });
  }, []);
  const { addToCart, cart, updateQuantity } = useCart();

  const [dynamicOffers, setDynamicOffers] = useState([]);

  const handleAddToCart = (service) => {
    addToCart({
      id: service.id || service._id,
      name: service.title || service.name,
      price: service.price,
      image: service.image || service.imageUrl,
      category: service.category || 'Special Offer'
    });
    toast.success(`${service.title || service.name} added to cart!`);
  };

  useEffect(() => {
    // Unix user state logic (Session vs LocalStorage)
    const initUser = () => {
      // 1. Try Session
      if (session?.user) {
        setUser(session.user);
        fetchBookings(session.user.email);
        return;
      }

      // 2. Try Local Storage (Force check)
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('user');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setUser(parsed);
            fetchBookings(parsed.email);
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Try JWT Cookie (for email verification flow)
      fetchUserFromAPI();
    };

    const fetchUserFromAPI = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('user-updated'));
          fetchBookings(data.user.email);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/banners?t=' + Date.now());
        const data = await res.json();
        if (data.success) {
          setDynamicOffers(data.banners);
        }
      } catch (e) {
        console.error('Offers fetch error', e);
      }
    };
    fetchOffers();

    const fetchBookings = async (email) => {
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/bookings?role=user&email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // Listen for events to refresh user state
    window.addEventListener('user-login', initUser);
    window.addEventListener('user-updated', initUser);
    return () => {
      window.removeEventListener('user-login', initUser);
      window.removeEventListener('user-updated', initUser);
    };
  }, [session, status]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-login')); // Sync header
    signOut({ callbackUrl: '/' });
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  if (!user) {
    return (
      <div className="app">
        <Header />
        <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="login-prompt" style={{ padding: '4rem 0' }}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your profile and bookings.</p>
          <button onClick={() => router.push('/login')} className="primary-btn">Login Now</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Profile Dashboard Section */}
      <section className="profile-dashboard-section" style={{ background: '#f9fafb', padding: '20px 0' }}>
        <div className="profile-container">
          {/* Sidebar / User Card */}
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="profile-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <span>{(user.fullName || user.name || 'U').charAt(0)}</span>
                )}
              </div>
              <div className="user-info-text">
                <h3>{user.fullName || user.name || 'User'}</h3>
                <p className="user-email">{user.email}</p>
                <p className="user-phone">{user.phone}</p>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                <ShoppingCart size={18} /> Shop Services
              </button>
              <button
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <User size={18} /> Account Settings
              </button>
            </div>

            {activeTab === 'shop' && (
              <div className="shop-tab">
                <div className="tab-header-flex">
                  <h2>Special Offers & Services</h2>
                  <button onClick={() => router.push('/cart')} className="view-cart-link">
                    View My Cart ({cart.length})
                  </button>
                </div>

                <div className="quick-services-grid">
                  {dynamicOffers.length > 0 ? (
                    dynamicOffers.map((service) => {
                      const inCart = cart.find(item => item.id === (service._id || service.id));
                      return (
                        <div key={service._id || service.id} className="quick-service-card">
                          <img src={service.imageUrl || service.image || '/placeholder.jpg'} alt={service.title} style={{ objectFit: 'cover' }} />
                          <div className="q-info">
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{service.title || service.name}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <p style={{ margin: 0, fontWeight: 700, color: '#2563EB' }}>₹{service.price}</p>
                              {service.badge && <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#FEF3C7', color: '#D97706', borderRadius: '4px' }}>{service.badge}</span>}
                            </div>
                            {inCart ? (
                              <div className="in-cart-controls">
                                <button onClick={() => updateQuantity(service._id || service.id, inCart.quantity - 1)}><Minus size={14} /></button>
                                <span>{inCart.quantity}</span>
                                <button onClick={() => updateQuantity(service._id || service.id, inCart.quantity + 1)}><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button className="q-add-btn" onClick={() => handleAddToCart(service)}>
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                      <Package size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                      <p>No special offers currently available.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-panel">
                <h2>Account Settings</h2>
                <p>Coming Soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rest of the Home Page Components */}
      <OffersSection />
      <SolarWaterSection />
      <HomeRenovationSection />
      <EssentialServicesSection />
      <MostBookedSection />
      <ServiceBanners />
      <WhyChoose />
      {sections.length > 0 && <DynamicSectionRenderer sections={sections} />}
      <Footer />
    </div>
  );
}
