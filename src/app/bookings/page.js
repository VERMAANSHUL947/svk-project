'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, MapPin, ArrowLeft, Package } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './bookings.css';

export default function BookingsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

    useEffect(() => {
        const initUser = () => {
            // Try session first
            if (session?.user) {
                setUser(session.user);
                fetchBookings(session.user.email);
                return;
            }

            // Try localStorage
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

            // Try API
            fetchUserFromAPI();
        };

        const fetchUserFromAPI = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    fetchBookings(data.user.email);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setLoading(false);
            }
        };

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
    }, [session]);

    const handleUpdateStatus = async (bookingId, newStatus) => {
        if (!confirm(`Are you sure you want to mark this service as ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
            } else {
                alert(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        if (filter === 'pending') return booking.status === 'Pending';
        if (filter === 'completed') return booking.status === 'Completed';
        if (filter === 'cancelled') return booking.status === 'Cancelled';
        return true;
    });

    const statusColors = {
        'Pending': '#F59E0B',
        'Confirmed': '#3B82F6',
        'In-Progress': '#8B5CF6',
        'Completed': '#10B981',
        'Cancelled': '#EF4444'
    };

    if (loading) {
        return (
            <div className="app">
                <Header />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="app">
                <Header />
                <div className="login-prompt-container">
                    <h2>Please Login</h2>
                    <p>You need to be logged in to view your bookings.</p>
                    <button onClick={() => router.push('/login')} className="login-btn">
                        Login Now
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app">
            <Header />

            <div className="bookings-page">
                {/* Page Header */}
                <div className="page-header">
                    <button onClick={() => router.push('/')} className="back-btn">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </button>

                    <div className="header-content">
                        <div className="header-left">
                            <Package size={32} color="#2563EB" />
                            <div>
                                <h1>My Bookings</h1>
                                <p>View and manage all your service bookings</p>
                            </div>
                        </div>

                        <div className="user-info">
                            <div className="user-avatar">
                                {(user.fullName || user.name || 'U').charAt(0)}
                            </div>
                            <div>
                                <p className="user-name">{user.fullName || user.name}</p>
                                <p className="user-email">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Bookings ({bookings.length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({bookings.filter(b => b.status === 'Pending').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({bookings.filter(b => b.status === 'Completed').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        Cancelled ({bookings.filter(b => b.status === 'Cancelled').length})
                    </button>
                </div>

                {/* Bookings List */}
                <div className="bookings-container">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Package size={64} color="#9CA3AF" />
                            <h3>No bookings found</h3>
                            <p>You haven't made any bookings yet. Start booking services now!</p>
                            <button onClick={() => router.push('/')} className="book-now-btn">
                                Browse Services
                            </button>
                        </div>
                    ) : (
                        <div className="bookings-grid">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="booking-card"
                                    onClick={() => router.push(`/booking/${booking._id}`)}
                                >
                                    <div className="booking-card-header">
                                        <span className="order-id">
                                            ORDER #{booking._id.slice(-6).toUpperCase()}
                                        </span>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background: `${statusColors[booking.status]}20`,
                                                color: statusColors[booking.status]
                                            }}
                                        >
                                            <span
                                                className="status-dot"
                                                style={{ background: statusColors[booking.status] }}
                                            ></span>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="booking-card-body">
                                        <div className="service-info">
                                            <h3>{booking.items[0]?.name || booking.category}</h3>
                                            <p className="category-badge">{booking.category}</p>
                                        </div>

                                        <div className="booking-meta">
                                            <div className="meta-row">
                                                <Calendar size={16} color="#6B7280" />
                                                <span>{booking.scheduledDate || 'Not scheduled'}</span>
                                            </div>
                                            <div className="meta-row">
                                                <Clock size={16} color="#6B7280" />
                                                <span>{booking.scheduledTimeSlot || 'Not scheduled'}</span>
                                            </div>
                                            <div className="meta-row">
                                                <MapPin size={16} color="#6B7280" />
                                                <span>{booking.userDetails?.city || 'Home'}</span>
                                            </div>
                                        </div>

                                        <div className="booking-footer">
                                            <div className="price-section">
                                                <span className="price-label">Total Amount</span>
                                                <span className="price-value">₹{booking.totalAmount}</span>
                                            </div>
                                            <div className="action-row" style={{ display: 'flex', gap: '10px' }}>
                                                {booking.status === 'Confirmed' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateStatus(booking._id, 'Completed');
                                                        }}
                                                        className="complete-btn"
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: '#10B981',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        Complete Service
                                                    </button>
                                                )}
                                                <button className="view-details-btn">
                                                    Details →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
