'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, User, LogOut, Settings, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import './Header.css';

export default function Header() {
  const { getCartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = getCartCount();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Immediate check from local storage to avoid "Guest" flash
    const localData = localStorage.getItem('user');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const fetchUser = async () => {
      // 1. Try NextAuth first
      if (status === 'authenticated' && session) {
        const userData = {
          fullName: session.user.fullName || session.user.name,
          profileImage: session.user.profileImage || session.user.image,
          email: session.user.email,
          phone: session.user.phone
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user-updated')); // Sync components immediately
        return;
      }

      // 2. Try Custom JWT API
      try {
        // Prevent caching to ensure we get real auth status
        const res = await fetch('/api/auth/me', { headers: { 'Cache-Control': 'no-cache' } });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('user-updated')); // Notify components like Cart
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };

    fetchUser();

    // Listen for custom login event to refresh header immediately
    const handleLoginEvent = () => fetchUser();
    window.addEventListener('user-login', handleLoginEvent);
    return () => window.removeEventListener('user-login', handleLoginEvent);
  }, [session, status]);

  // Refresh user data explicitly when opening the dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      const localData = localStorage.getItem('user');
      if (localData) {
        try {
          setUser(JSON.parse(localData));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isDropdownOpen]);

  // Combined best-available user data
  const currentUser = user || (status === 'authenticated' ? session?.user : null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      setUser(null);
      if (status === 'authenticated') {
        signOut({ callbackUrl: '/login' });
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo" onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #f59e0b 25%, #fbbf24 50%, #10b981 75%, #3b82f6 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '900',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>🏠</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{
              fontSize: '20px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Urban<span style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>fixo</span>
            </span>
            <span style={{
              fontSize: '9px',
              color: '#64748b',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>Home Services Simplified</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Search for services..." />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="header-actions">
          <button className="location-btn">
            <MapPin size={16} />
            Use Current Location
          </button>

          <button className="partner-btn" onClick={() => router.push('/partner/login')}>
            🤝 Join as Partner
          </button>

          <div className="cart" onClick={() => router.push('/cart')}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          <div className="profile-wrapper">
            <div
              className="user-profile-header"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ border: isDropdownOpen ? '1.5px solid #2563eb' : '1.5px solid #fbbf24' }}
            >
              {currentUser?.profileImage || currentUser?.image ? (
                <img src={currentUser.profileImage || currentUser.image} alt="User" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.fullName || currentUser?.name ? (currentUser.fullName || currentUser.name).charAt(0) : <User size={20} />}
                </div>
              )}
              <div className="dropdown-arrow">
                <ChevronDown size={12} color={isDropdownOpen ? '#2563eb' : '#fbbf24'} />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown-menu">
                {currentUser ? (
                  <>

                    <div className="dropdown-user-info" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div className="dropdown-avatar" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                        {currentUser.profileImage || currentUser.image ? (
                          <img src={currentUser.profileImage || currentUser.image} alt="User" />
                        ) : (
                          <div className="avatar-placeholder-small" style={{ fontSize: '24px' }}>{(currentUser.fullName || currentUser.name)?.charAt(0)}</div>
                        )}
                      </div>
                      <div className="dropdown-meta" style={{ marginTop: '10px' }}>
                        <h4 style={{ fontSize: '16px' }}>Welcome back,</h4>
                        <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                          {currentUser.fullName || currentUser.name || currentUser.email || 'Member'}
                        </p>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-item" onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}>
                      <User size={18} /> My Profile
                    </div>
                    <div className="dropdown-item" onClick={() => { router.push('/bookings'); setIsDropdownOpen(false); }}>
                      <ShoppingBag size={18} /> My Bookings
                    </div>

                    {pathname === '/profile' && (
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </div>
                    )}
                  </>
                ) : (
                  <>

                    <div className="dropdown-user-info">
                      {pathname === '/profile' ? (
                        // Force show cache or Fetch live if missing
                        (() => {
                          let cachedUser = null;
                          if (typeof window !== 'undefined') {
                            const saved = localStorage.getItem('user');
                            if (saved) {
                              cachedUser = JSON.parse(saved);
                            } else {
                              // Emergency Fetch if on profile but no data
                              fetch('/api/auth/me').then(r => r.json()).then(d => {
                                if (d.success) {
                                  localStorage.setItem('user', JSON.stringify(d.user));
                                  // Trigger reload
                                  window.dispatchEvent(new Event('user-login'));
                                }
                              });
                            }
                          }
                          return (
                            <>
                              <div className="dropdown-user-info" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0', width: '100%' }}>
                                <div className="dropdown-avatar" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                                  {cachedUser?.profileImage ? (
                                    <img src={cachedUser.profileImage} alt="User" />
                                  ) : (
                                    <div className="avatar-placeholder-small" style={{ fontSize: '24px' }}>{(cachedUser?.fullName || cachedUser?.name || 'U')?.charAt(0)}</div>
                                  )}
                                </div>
                                <div className="dropdown-meta" style={{ marginTop: '10px' }}>
                                  <h4 style={{ fontSize: '16px' }}>Welcome back,</h4>
                                  <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                                    {cachedUser?.fullName || cachedUser?.name || cachedUser?.email || 'Loading...'}
                                  </p>
                                  {/* Only show email line if we didn't use it as the name */}
                                  {(cachedUser?.fullName || cachedUser?.name) && (
                                    <p style={{ fontSize: '12px', color: '#64748b' }}>{cachedUser?.email}</p>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <>
                          <h4>Welcome, Guest</h4>
                          <p>Login to manage your bookings</p>
                        </>
                      )}
                    </div>
                    <div className="dropdown-divider"></div>
                    {pathname !== '/profile' && (
                      <>
                        <button
                          className="dropdown-login-btn"
                          onClick={() => { router.push('/login'); setIsDropdownOpen(false); }}
                        >
                          Login
                        </button>
                        <button
                          className="dropdown-signup-btn"
                          onClick={() => { router.push('/signup'); setIsDropdownOpen(false); }}
                        >
                          Sign Up
                        </button>
                      </>
                    )}

                    {pathname === '/profile' && (
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

