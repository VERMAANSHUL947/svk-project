'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import '../admin.css';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [recoveryKey, setRecoveryKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRecoveryKey, setShowRecoveryKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, recoveryKey }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Password updated successfully! Redirecting...');
                setTimeout(() => router.push('/admin/login'), 2000);
            } else {
                toast.error(data.error || 'Reset failed');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            {/* Left Hero Panel */}
            <div className="admin-hero">
                <div className="admin-hero-header">
                    <div className="admin-logo">🏠</div>
                    <h2>HomeServices Hub</h2>
                </div>

                <div className="admin-hero-content">
                    <div className="admin-hero-badge">MARKETPLACE LEADER</div>
                    <h1>Grow your service business with us.</h1>
                    <p>
                        Join over 15,000 professional technicians and home service providers scaling their operations through our platform.
                    </p>
                    <div className="admin-stats">
                        <div className="stat-item">
                            <h3>98%</h3>
                            <p>Satisfaction Rate</p>
                        </div>
                        <div className="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
                </div>

                <div className="admin-hero-footer">
                    © 2025-2027 HomeServices Hub. All rights reserved.
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="admin-form-panel">
                <div className="admin-form-header">
                    <div className="admin-nav-links">
                        <a href="/">Support</a>
                        <a href="/">Help Center</a>
                    </div>
                </div>

                <div className="auth-box">
                    <div className="auth-box-header">
                        <h1>Reset Password</h1>
                        <p>Enter your details to reset your admin password</p>
                    </div>

                    <form onSubmit={handleReset} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="with-icon"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="with-icon"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Recovery Key (Secret)</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔑</span>
                                <input
                                    type={showRecoveryKey ? 'text' : 'password'}
                                    required
                                    value={recoveryKey}
                                    onChange={(e) => setRecoveryKey(e.target.value)}
                                    placeholder="Ask admin for key"
                                    className="with-icon"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowRecoveryKey(!showRecoveryKey)}
                                >
                                    {showRecoveryKey ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? <span className="loading-spinner"></span> : 'Reset Password'}
                        </button>

                        <div className="auth-footer">
                            <p>
                                Remember your password? <a href="/admin/login">Back to Login</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
