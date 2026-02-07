'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import '../admin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        activeUsers: 0,
        partners: 0,
        activePartners: 0,
        bookings: 0
    });

    const [approvalQueue, setApprovalQueue] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            router.push('/admin/login');
            return;
        }

        const loadDashboard = async () => {
            setLoading(true);
            await Promise.all([fetchPendingPartners(), fetchStats(), fetchActivity(), fetchRecentBookings()]);
            setLoading(false);
        };
        loadDashboard();
    }, [router]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (data.success) {
                setStats({
                    revenue: data.stats.revenue,
                    activeUsers: data.stats.totalUsers,
                    partners: data.stats.totalPartners,
                    activePartners: data.stats.verifiedPartners,
                    bookings: data.stats.bookings
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const fetchActivity = async () => {
        try {
            const res = await fetch('/api/admin/activity');
            const data = await res.json();
            if (data.success) {
                setActivityFeed(data.activities);
            }
        } catch (error) {
            console.error('Failed to fetch activity');
        }
    };

    const fetchRecentBookings = async () => {
        try {
            const res = await fetch('/api/bookings?role=admin');
            const data = await res.json();
            if (data.success) {
                setRecentBookings(data.bookings.slice(0, 5)); // Show top 5
            }
        } catch (error) {
            console.error('Failed to fetch bookings');
        }
    };

    const fetchPendingPartners = async () => {
        try {
            const res = await fetch('/api/admin/partners/pending');
            const data = await res.json();
            if (data.success) {
                setApprovalQueue(data.partners);
            }
        } catch (error) {
            console.error('Failed to fetch partners');
        }
    };

    const handleAction = async (partnerId, action) => {
        try {
            const res = await fetch('/api/admin/partners/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partnerId, action })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                // Remove from local list
                setApprovalQueue(prev => prev.filter(p => p._id !== partnerId));

                // Update stats locally for immediate feedback (optional)
                setStats(prev => ({ ...prev, partners: action === 'approve' ? prev.partners + 1 : prev.partners }));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Action failed');
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="bottom-right" theme="dark" />

            {/* MOBILE OVERLAY */}
            <div className="sidebar-overlay" id="admin-sidebar-overlay" onClick={() => {
                document.querySelector('.sidebar').classList.remove('mobile-open');
                document.getElementById('admin-sidebar-overlay').classList.remove('active');
            }} />

            <AdminSidebar />

            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Welcome back, here's what's happening in your business.</p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">Total Revenue</div>
                        <div className="stat-value">₹{(stats.revenue).toLocaleString()}</div>
                        <div className="stat-subtext">
                            <span className="growth-badge positive">↑ 12.5%</span> vs last month
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Active Users</div>
                        <div className="stat-value">{stats.activeUsers}</div>
                        <div className="stat-subtext">
                            <span className="growth-badge positive">↑ 8.2%</span> vs last month
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Onboarded Partners</div>
                        <div className="stat-value">{stats.partners}</div>
                        <div className="stat-subtext">
                            <span className="growth-badge neutral">→ 0.5%</span> vs last month
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Total Bookings</div>
                        <div className="stat-value">{stats.bookings}</div>
                        <div className="stat-subtext">
                            <span className="growth-badge positive">↑ 15.3%</span> vs last month
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Left Column: Partner Approval */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Partner Approval Queue</h3>
                            <a href="/admin/partners" className="view-all">View All</a>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Partner Name</th>
                                        <th>Service Category</th>
                                        <th>Status</th>
                                        <th>Applied Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading pending partners...</td></tr>
                                    ) : approvalQueue.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No pending approvals</td></tr>
                                    ) : (
                                        approvalQueue.map(partner => (
                                            <tr key={partner._id}>
                                                <td>
                                                    <div className="user-info">
                                                        <div className="user-img">{partner.fullName?.charAt(0) || 'P'}</div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'white' }}>{partner.fullName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{partner.phoneNumber}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{partner.serviceCategory}</td>
                                                <td>
                                                    <span className={`status-badge status-pending`}>
                                                        {partner.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button onClick={() => handleAction(partner._id, 'approve')} className="btn-sm btn-approve">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            Approve
                                                        </button>
                                                        <button onClick={() => handleAction(partner._id, 'reject')} className="btn-sm btn-reject">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* New Column: Recent Bookings */}
                    <div className="section-card" style={{ gridColumn: 'span 2' }}>
                        <div className="section-header">
                            <h3 className="section-title">Recent Real-time Bookings</h3>
                            <a href="/admin/bookings" className="view-all">View All</a>
                        </div>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No bookings found</td></tr>
                                    ) : (
                                        recentBookings.map(b => (
                                            <tr key={b._id}>
                                                <td style={{ color: '#60A5FA', fontSize: '0.8rem' }}>#{b._id.substring(b._id.length - 6).toUpperCase()}</td>
                                                <td>{b.userDetails?.name || 'Guest'}</td>
                                                <td>{b.items && b.items.length > 0 ? b.items[0].name : b.category}</td>
                                                <td>{b.scheduledDate}</td>
                                                <td><span className={`status-badge status-${b.status.toLowerCase()}`}>● {b.status}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Live Feed */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Live Activity</h3>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '1rem' }}>Loading activity...</div>
                            ) : activityFeed.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '1rem' }}>No recent activity</div>
                            ) : (
                                activityFeed.map((activity, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{
                                            minWidth: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: activity.type === 'partner' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                                            color: activity.type === 'partner' ? '#10B981' : '#2563EB',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {activity.type === 'partner' ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: 'white', marginBottom: '0.2rem' }}>{activity.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{activity.description}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '0.25rem' }}>
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
