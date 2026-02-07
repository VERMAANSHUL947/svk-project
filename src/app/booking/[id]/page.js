'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Package, CreditCard, User, Phone, Mail } from 'lucide-react';
import './booking-detail.css';

export default function BookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const res = await fetch(`/api/bookings/${bookingId}`);
                const data = await res.json();

                if (data.success) {
                    setBooking(data.booking);
                }
            } catch (err) {
                console.error('Error fetching booking:', err);
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading booking details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="error-container">
                <h2>Booking not found</h2>
                <button onClick={() => router.push('/profile')} className="back-btn">
                    Go Back
                </button>
            </div>
        );
    }

    const statusColors = {
        'Pending': '#F59E0B',
        'Confirmed': '#3B82F6',
        'In-Progress': '#8B5CF6',
        'Completed': '#10B981',
        'Cancelled': '#EF4444'
    };

    return (
        <div className="booking-detail-page">
            {/* Header */}
            <div className="detail-header">
                <button onClick={() => router.push('/profile')} className="back-button">
                    <ArrowLeft size={20} />
                    <span>Back to My Bookings</span>
                </button>

                <div className="header-info">
                    <h1>Booking Details</h1>
                    <p className="booking-id">Order #{booking._id.substring(booking._id.length - 6).toUpperCase()}</p>
                </div>

                <div className="status-badge" style={{ background: `${statusColors[booking.status]}20`, color: statusColors[booking.status] }}>
                    <span className="status-dot" style={{ background: statusColors[booking.status] }}></span>
                    {booking.status}
                </div>
            </div>

            {/* Main Content */}
            <div className="detail-content">
                {/* Left Column */}
                <div className="detail-left">
                    {/* Service Items */}
                    <div className="detail-card">
                        <div className="card-header">
                            <Package size={20} />
                            <h2>Service Details</h2>
                        </div>
                        <div className="items-list">
                            {booking.items.map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <div className="item-info">
                                        <div className="item-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <div className="item-placeholder">🔧</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p className="item-category">{item.category || booking.category}</p>
                                        </div>
                                    </div>
                                    <div className="item-pricing">
                                        <p className="item-quantity">Qty: {item.quantity || 1}</p>
                                        <p className="item-price">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="total-row">
                            <span>Total Amount</span>
                            <span className="total-amount">₹{booking.totalAmount}</span>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="detail-card">
                        <div className="card-header">
                            <Calendar size={20} />
                            <h2>Schedule Information</h2>
                        </div>
                        <div className="schedule-info">
                            <div className="info-row">
                                <Calendar size={18} color="#6B7280" />
                                <div>
                                    <p className="info-label">Date</p>
                                    <p className="info-value">{booking.scheduledDate || 'Not scheduled'}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <Clock size={18} color="#6B7280" />
                                <div>
                                    <p className="info-label">Time Slot</p>
                                    <p className="info-value">{booking.scheduledTimeSlot || 'Not scheduled'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="detail-right">
                    {/* Customer Details */}
                    <div className="detail-card">
                        <div className="card-header">
                            <User size={20} />
                            <h2>Customer Information</h2>
                        </div>
                        <div className="customer-info">
                            <div className="info-row">
                                <User size={18} color="#6B7280" />
                                <div>
                                    <p className="info-label">Name</p>
                                    <p className="info-value">{booking.userDetails?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <Mail size={18} color="#6B7280" />
                                <div>
                                    <p className="info-label">Email</p>
                                    <p className="info-value">{booking.userDetails?.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="info-row">
                                <Phone size={18} color="#6B7280" />
                                <div>
                                    <p className="info-label">Phone</p>
                                    <p className="info-value">{booking.userDetails?.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="detail-card">
                        <div className="card-header">
                            <MapPin size={20} />
                            <h2>Service Address</h2>
                        </div>
                        <div className="address-info">
                            <p className="address-text">
                                {booking.userDetails?.houseNo && `${booking.userDetails.houseNo}, `}
                                {booking.userDetails?.street && `${booking.userDetails.street}, `}
                                {booking.userDetails?.landmark && `${booking.userDetails.landmark}, `}
                                {booking.userDetails?.city && `${booking.userDetails.city}, `}
                                {booking.userDetails?.state && `${booking.userDetails.state} `}
                                {booking.userDetails?.pincode && `- ${booking.userDetails.pincode}`}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="detail-card">
                        <div className="card-header">
                            <CreditCard size={20} />
                            <h2>Payment Information</h2>
                        </div>
                        <div className="payment-info">
                            <div className="payment-row">
                                <span>Payment Status</span>
                                <span className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                            <div className="payment-row">
                                <span>Amount Paid</span>
                                <span className="amount-paid">₹{booking.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
