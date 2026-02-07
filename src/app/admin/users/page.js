'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import '../admin.css';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        newJoined: 0,
        pendingVerification: 0,
        suspendedAccounts: 0
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        perPage: 10
    });

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: 10,
                search: search,
                status: statusFilter
            });
            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setPagination(data.pagination);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchUsers(newPage);
        }
    };

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Admin / Users</p>
                </div>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">Total Customers <span className="growth-badge positive">+12%</span></div>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">New Joined <span className="growth-badge positive">+8%</span></div>
                        <div className="stat-value">{stats.newJoined}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Pending Verification <span className="growth-badge neutral">Pending</span></div>
                        <div className="stat-value">{stats.pendingVerification}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Suspended Accounts <span className="growth-badge negative">Suspended</span></div>
                        <div className="stat-value">{stats.suspendedAccounts}</div>
                    </div>
                </div>

                {/* Filters and Table */}
                <div className="section-card">
                    <div className="filters-bar" style={{ borderBottom: '1px solid #1F2937', borderRadius: '16px 16px 0 0', marginBottom: 0 }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <svg style={{ position: 'absolute', left: '10px', top: '10px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ background: '#0B0E14', border: '1px solid #1F2937', padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '6px', color: 'white', width: '100%', outline: 'none' }}
                            />
                        </div>

                        <div className="filter-group">
                            <select className="filter-select">
                                <option>All Cities</option>
                                <option>New York</option>
                                <option>London</option>
                            </select>
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All Status">All Status</option>
                                <option value="Verified">Verified</option>
                                <option value="Pending">Pending</option>
                            </select>
                            <button className="btn-primary" onClick={() => fetchUsers(1)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Apply Filters</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>Total Bookings</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'white' }}>Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>No users found.</td></tr>
                                ) : users.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-img">{(user.fullName || user.email || 'U').charAt(0).toUpperCase()}</div>
                                                <span style={{ fontWeight: '500', color: 'white' }}>{user.fullName || 'No Name'}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#9CA3AF' }}>{user.email}</td>
                                        <td>{user.phone || 'N/A'}</td>
                                        <td>{user.bookings?.length || 0} Bookings</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge status-${user.isVerified ? 'active' : 'pending'}`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid #1F2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        <span>Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.totalUsers)} of {pagination.totalUsers} customers</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                style={{ background: '#1F2937', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer', opacity: pagination.currentPage === 1 ? 0.5 : 1 }}
                            >
                                Previous
                            </button>

                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    style={{
                                        background: pagination.currentPage === i + 1 ? '#2563EB' : '#1F2937',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                style={{ background: '#1F2937', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: pagination.currentPage === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.currentPage === pagination.totalPages ? 0.5 : 1 }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
