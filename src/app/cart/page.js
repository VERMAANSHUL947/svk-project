'use client';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Trash2, Plus, Minus, MapPin, Calendar, Clock } from 'lucide-react';
import './Cart.css';

export default function CartPage() {
    const { data: session, status } = useSession();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [user, setUser] = useState(null); // Unified user state

    // Hybrid Auth Check: Sync with Header logic
    // Hybrid Auth Check: Sync with Header logic & Force Load
    useEffect(() => {
        const checkUser = () => {
            let finalUser = null;
            let localUser = null;

            // Get Local Storage User
            if (typeof window !== 'undefined') {
                const local = localStorage.getItem('user');
                if (local) {
                    try {
                        localUser = JSON.parse(local);
                    } catch (e) {
                        console.error("Local user parse error", e);
                    }
                }
            }

            // 1. Try Session
            if (session?.user) {
                // Merge strategies: Use Session for Auth/Email/Name, but keep Phone from Local if missing in Session
                finalUser = {
                    ...session.user,
                    phone: session.user.phone || localUser?.phone || '',
                    fullName: session.user.name || session.user.fullName || localUser?.fullName || localUser?.name,
                };
            }
            // 2. Fallback to Local Storage if no Session
            else if (localUser && (localUser.email || localUser.name)) {
                finalUser = localUser;
            }

            if (finalUser) {
                setUser(finalUser);
            }
        };

        checkUser(); // Check immediately on mount/session change

        // 3. Listen for login events (from Header or Login page)
        const handleLoginEvent = () => checkUser();
        window.addEventListener('user-login', handleLoginEvent);
        window.addEventListener('user-updated', handleLoginEvent); // Listen for header updates
        return () => {
            window.removeEventListener('user-login', handleLoginEvent);
            window.removeEventListener('user-updated', handleLoginEvent);
        };
    }, [session, status]);

    // Unified User logic - Check localStorage directly on every render
    const activeUser = useMemo(() => {
        // 1. Try NextAuth session first
        if (status === 'authenticated' && session?.user) {
            return {
                ...session.user,
                fullName: session.user.fullName || session.user.name,
                phone: session.user.phone || user?.phone
            };
        }

        // 2. Try user state (from useEffect)
        if (user && user.email) {
            return user;
        }

        // 3. Fallback: Read localStorage directly
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.email) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.error('localStorage parse error:', e);
            }
        }

        return null;
    }, [status, session, user]);

    // Debug logging
    useEffect(() => {
        const localStorageData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        console.log('Cart Debug:', {
            status,
            hasSession: !!session,
            hasUser: !!user,
            localStorageUser: localStorageData ? 'exists' : 'missing',
            activeUser: activeUser?.email || 'none'
        });
    }, [status, session, user, activeUser]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    // Generate next 4 days dynamically
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 4; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            const day = nextDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const dateNum = nextDate.getDate();
            dates.push(`${day} ${dateNum}`);
        }
        return dates;
    };
    const dateOptions = generateDates();

    const subtotal = getCartTotal();
    const convenienceFee = 2.00;
    const serviceFee = 2.80;
    const taxes = 1.45;
    const total = subtotal - discount + convenienceFee + serviceFee + taxes;

    const applyCoupon = () => {
        if (couponCode === 'SAVE10') {
            setDiscount(subtotal * 0.1);
        }
    };

    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        const address = {
                            name: 'Current Location',
                            street: data.address.road || data.address.suburb || data.address.neighbourhood || '',
                            city: data.address.city || data.address.town || data.address.village || '',
                            state: data.address.state || '',
                            postcode: data.address.postcode || '',
                            country: data.address.country || '',
                            fullAddress: data.display_name,
                            coordinates: { latitude, longitude }
                        };
                        setCurrentLocation(address);
                    } else {
                        setLocationError('Unable to get address from coordinates');
                    }
                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    setLocationError('Failed to get address details');
                }
                setIsLoadingLocation(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                if (error.code === 1) errorMessage = 'Location permission denied.';
                else if (error.code === 2) errorMessage = 'Location unavailable.';
                else if (error.code === 3) errorMessage = 'Location request timed out.';
                setLocationError(errorMessage);
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
        );
    };

    const handleCheckout = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select a date and time.');
            return;
        }
        if (!currentLocation) {
            alert('Please select a service address.');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: total,
                    userDetails: {
                        name: activeUser?.fullName || activeUser?.name || 'Guest',
                        email: activeUser?.email || '',
                        phone: activeUser?.phone || '',
                        address: currentLocation,
                    },
                    scheduledDate: selectedDate,
                    scheduledTimeSlot: selectedTime
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Booking Confirmed Successfully!');
                clearCart();
                router.push('/profile');
            } else {
                alert('Booking Failed: ' + data.message);
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('An error occurred during checkout.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <div className="empty-cart-content">
                    <h2>Your Cart is Empty</h2>
                    <p>Add some services to get started!</p>
                    <button onClick={() => router.push('/')} className="continue-shopping">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <button onClick={() => router.push('/')} className="back-btn">
                    ← Back to Home
                </button>
                <h1>Checkout</h1>
                <p>Complete your booking in 3 easy steps</p>
            </div>

            <div className="checkout-container">
                <div className="checkout-steps">
                    {/* Step 1: Login & Verification */}
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setCurrentStep(1)}>
                            <div className="step-number">1</div>
                            <div className="step-info">
                                <h3>Login & Verification</h3>
                                <p className="step-status">
                                    {activeUser ? (
                                        <>Logged in as {activeUser.fullName || activeUser.name || activeUser.email} <span style={{ color: '#059669' }}>✓</span></>
                                    ) : (
                                        <span style={{ color: '#DC2626' }}>Please Login to proceed</span>
                                    )}
                                </p>
                            </div>
                            {currentStep !== 1 && <button className="change-btn">CHANGE</button>}
                        </div>
                        {currentStep === 1 && !activeUser && (
                            <div className="step-content">
                                <p style={{ marginBottom: '1rem', color: '#4B5563' }}>You need an account to book services.</p>
                                <button className="proceed-btn" onClick={() => router.push('/login?callbackUrl=/cart')}>Login / Signup</button>
                            </div>
                        )}
                        {currentStep === 1 && activeUser && (
                            <div className="step-content">
                                <p>Welcome back, <strong>{activeUser.fullName || activeUser.name}</strong>!</p>
                                <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>{activeUser.email}</p>
                                <button className="proceed-btn" style={{ marginTop: '10px' }} onClick={() => setCurrentStep(2)}>Continue</button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Select Service Address */}
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setCurrentStep(2)}>
                            <div className="step-number">2</div>
                            <div className="step-info">
                                <h3>Select Service Address</h3>
                            </div>
                        </div>

                        {currentStep === 2 && (
                            <div className="step-content">
                                <button className="use-location-btn" onClick={getCurrentLocation} disabled={isLoadingLocation}>
                                    <MapPin size={20} />
                                    {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
                                </button>
                                {locationError && <div className="location-error">⚠️ {locationError}</div>}
                                {currentLocation && (
                                    <div className="address-card current-location">
                                        <MapPin size={20} className="address-icon" />
                                        <div className="address-details">
                                            <h4>CURRENT LOCATION 📍</h4>
                                            <p className="address-text">{currentLocation.fullAddress}</p>
                                        </div>
                                        <div className="selected-badge">✓</div>
                                    </div>
                                )}
                                <button className="proceed-btn" onClick={() => setCurrentStep(3)}>Continue to Schedule</button>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Schedule Service */}
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setCurrentStep(3)}>
                            <div className="step-number">3</div>
                            <div className="step-info">
                                <h3>Schedule Service</h3>
                            </div>
                        </div>
                        {currentStep === 3 && (
                            <div className="step-content">
                                <div className="schedule-section">
                                    <h4>Select Date</h4>
                                    <div className="date-selector">
                                        {dateOptions.map((date, idx) => (
                                            <button key={idx} className={`date-btn ${selectedDate === date ? 'selected' : ''}`} onClick={() => setSelectedDate(date)}>
                                                <div className="date-day">{date.split(' ')[0]}</div>
                                                <div className="date-num">{date.split(' ')[1]}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="schedule-section">
                                    <h4>Select Arrival Time</h4>
                                    <div className="time-selector">
                                        {['08:00 AM', '11:00 AM', '02:00 PM', '05:00 PM'].map((time, idx) => (
                                            <button key={idx} className={`time-btn ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>
                                                <Clock size={16} />
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Booking Summary */}
                <div className="booking-summary">
                    <h3>Booking Summary</h3>
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item-summary">
                                <img src={item.image || '/images/service-placeholder.png'} alt={item.name} />
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">₹{item.price.toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                    </div>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="coupon-section">
                        <input type="text" placeholder="Enter code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                        <button onClick={applyCoupon} className="apply-btn">APPLY</button>
                    </div>

                    <div className="price-breakdown">
                        <div className="price-row"><span>Item Total</span><span>₹{subtotal.toFixed(2)}</span></div>
                        {discount > 0 && <div className="price-row discount"><span>Coupon Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                        <div className="price-row"><span>Convenience Fee</span><span>₹{convenienceFee.toFixed(2)}</span></div>
                        <div className="price-row"><span>Service Fee</span><span>₹{serviceFee.toFixed(2)}</span></div>
                        <div className="price-row"><span>Taxes</span><span>₹{taxes.toFixed(2)}</span></div>
                        <div className="price-row total"><span>Total Amount</span><span className="total-amount">₹{total.toFixed(2)}</span></div>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>Pay & Book Now 💰</button>

                    <div className="guarantee-badges">
                        <div className="badge"><span>✓</span><p>SECURE PAYMENT</p></div>
                        <div className="badge"><span>✓</span><p>VERIFIED EXPERTS</p></div>
                        <div className="badge"><span>✓</span><p>24/7 SUPPORT</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
