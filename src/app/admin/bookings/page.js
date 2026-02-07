'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { bookingsData } from '@/lib/admin-data';
import '../admin.css';

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState('All Bookings');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings?role=admin');
                const data = await res.json();
                if (data.success) {
                    const formattedBookings = data.bookings.map(b => ({
                        id: '#' + b._id.substring(b._id.length - 6).toUpperCase(),
                        customer: b.userDetails?.name || 'Guest',
                        customerEmail: b.userDetails?.email || 'N/A',
                        service: b.items && b.items.length > 0 ? b.items.map(i => i.name).join(', ') : b.category,
                        partner: b.partnerName || 'Unassigned',
                        schedule: `${b.scheduledDate || ''} ${b.scheduledTimeSlot || ''}`,
                        status: b.status
                    }));
                    setBookings(formattedBookings);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setBookings([]); // Return empty instead of mock on error
            }
        };
        fetchBookings();
    }, []);

    const filteredBookings = activeTab === 'All Bookings'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Bookings</h1>
                        <p className="page-subtitle">Manage and monitor all service requests</p>
                    </div>
                    <button className="btn-add">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Booking
                    </button>
                </div>

                {/* Search & Date Filter Bar */}
                <div style={{ background: '#151A23', padding: '1rem', borderRadius: '12px', border: '1px solid #1F2937', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="tabs-container" style={{ padding: 0, margin: 0, border: 'none' }}>
                        {['All Bookings', 'Pending', 'Assigned', 'Completed'].map(tab => (
                            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem' }}>
                                {tab}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>📅 10/24/2023 — 11/24/2023</div>
                        <button style={{ background: 'transparent', border: '1px solid #374151', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>More Filters</button>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="section-card">
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer</th>
                                    <th>Service Type</th>
                                    <th>Partner Assigned</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td style={{ color: '#60A5FA', fontFamily: 'monospace' }}>{booking.id}</td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-img" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>{booking.customer.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{booking.customer}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{booking.customerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{booking.service}</td>
                                        <td>
                                            {booking.partner === 'Unassigned' ? (
                                                <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Unassigned</span>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '4px' }}></div>
                                                    {booking.partner}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                            <div style={{ fontWeight: '600' }}>{booking.schedule.split(' ')[0]} {booking.schedule.split(' ')[1]} {booking.schedule.split(' ')[2]}</div>
                                            <div style={{ color: '#9CA3AF' }}>{booking.schedule.split(' ').slice(3).join(' ')}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>● {booking.status}</span>
                                        </td>
                                        <td>
                                            <svg style={{ cursor: 'pointer', color: '#9CA3AF' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid #1F2937', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        Showing 1 to {filteredBookings.length} results
                    </div>
                </div>

            </main>
        </div>
    );
}
