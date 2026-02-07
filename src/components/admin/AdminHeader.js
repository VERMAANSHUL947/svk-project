'use client';
import { useState, useEffect } from 'react';

export default function AdminHeader() {
    const [user, setUser] = useState({ fullName: 'Admin' });

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('adminUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        loadUser();

        // Listen for internal state changes
        window.addEventListener('adminUserUpdated', loadUser);
        window.addEventListener('storage', loadUser);

        return () => {
            window.removeEventListener('adminUserUpdated', loadUser);
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    return (
        <header className="top-header">
            {/* Mobile Menu Button - Just inline for simplicity */}
            <button className="mobile-menu-btn" onClick={() => {
                document.querySelector('.sidebar').classList.add('mobile-open');
                document.getElementById('admin-sidebar-overlay').classList.add('active');
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search across partners, users, and transactions..." />
            </div>

            <div className="header-actions">
                <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span className="notification-dot"></span>
                </div>
                <div className="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="user-profile">
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>{user.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Super Admin</div>
                    </div>
                    <div className="avatar">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                            user.fullName?.charAt(0) || 'A'
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
