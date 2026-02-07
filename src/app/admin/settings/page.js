'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { settingsConfig } from '@/lib/admin-data';
import '../admin.css';

export default function SettingsPage() {
    const [config, setConfig] = useState(settingsConfig);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch Settings on Mount
    useEffect(() => {
        // 1. First, check localStorage for dynamic session data
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setConfig(prev => ({
                    ...prev,
                    adminName: user.fullName || prev.adminName,
                    adminEmail: user.email || prev.adminEmail,
                    adminPhone: user.phone || prev.adminPhone
                }));
            } catch (e) {
                console.error('Error parsing stored user', e);
            }
        }

        // 2. Then, fetch system settings from API
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success) {
                    setConfig(prev => ({
                        ...prev,
                        serviceRadius: data.settings.serviceRadius,
                        commission: data.settings.commission,
                        maintenanceMode: data.settings.maintenanceMode,
                        twoFactor: data.settings.twoFactorEnabled,
                        // Only overwrite profile info if API has different values
                        adminName: data.settings.fullName || prev.adminName,
                        adminEmail: data.settings.email || prev.adminEmail,
                        adminPhone: data.settings.phone || prev.adminPhone,
                    }));
                    if (data.settings.profileImage) {
                        setImagePreview(data.settings.profileImage);
                    }
                }
            } catch (error) {
                console.error('Failed to load settings', error);
                // We initialized from localStorage above, so we don't necessarily error out profile info
                if (!localStorage.getItem('adminUser')) {
                    toast.error('Could not load system settings');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig({ ...config, [name]: value });
    };

    const handleToggle = (name) => {
        setConfig({ ...config, [name]: !config[name] });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Settings updated successfully!');

                // If backend returned a new image path, sync it
                if (data.profileImage) {
                    setImagePreview(data.profileImage);
                }

                // Update dynamic session data in localStorage
                const storedUser = localStorage.getItem('adminUser');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    const updatedUser = {
                        ...user,
                        fullName: config.adminName,
                        email: config.adminEmail,
                        phone: config.adminPhone,
                        profileImage: data.profileImage || user.profileImage
                    };
                    localStorage.setItem('adminUser', JSON.stringify(updatedUser));

                    // Trigger header refresh
                    window.dispatchEvent(new Event('adminUserUpdated'));
                }
            } else {
                toast.error('Failed to save: ' + data.message);
            }
        } catch (error) {
            toast.error('Network Error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Also update config for saving (if we want to send base64)
                setConfig(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUploadClick = () => {
        document.getElementById('profile-upload-input').click();
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset system configuration? This cannot be undone.')) {
            try {
                const res = await fetch('/api/admin/reset', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    toast.success(data.message);
                    // Reload settings
                    window.location.reload();
                } else {
                    toast.error('Reset failed');
                }
            } catch (err) {
                toast.error('Error resetting system');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="page-title">Settings</h1>
                        <p className="page-subtitle">Manage your system configurations and security preferences.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            height: 'fit-content',
                            padding: '0.6rem 1.5rem',
                            borderRadius: '8px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading && <div className="spinner-small"></div>}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="dashboard-grid">
                    {/* Column 1: Config */}
                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        {/* Platform Config */}
                        <div className="section-card">
                            <div className="section-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</div>
                                    <h3 className="section-title">Platform Config</h3>
                                </div>
                            </div>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group">
                                    <label>Service Radius (km)</label>
                                    <input type="number" name="serviceRadius" value={config.serviceRadius} onChange={handleChange} className="form-control" />
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>Define the maximum distance for service availability.</div>
                                </div>

                                <div className="form-group">
                                    <label>Commission Percentage (%)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="number" name="commission" value={config.commission} onChange={handleChange} className="form-control" />
                                        <span style={{ color: '#9CA3AF' }}>%</span>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <div>
                                        <label style={{ marginBottom: 0 }}>Maintenance Mode</label>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Temporarily disable public access</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={config.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="section-card">
                            <div className="section-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
                                    <h3 className="section-title">Security</h3>
                                </div>
                            </div>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label style={{ marginBottom: 0 }}>Two-Factor Authentication (OTP)</label>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Enable OTP verification for logins</div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={config.twoFactor} onChange={() => handleToggle('twoFactor')} />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div style={{ marginTop: '1rem', borderTop: '1px solid #1F2937', paddingTop: '1rem' }}>
                                    <label style={{ color: '#9CA3AF', marginBottom: '1rem', display: 'block' }}>Change Password</label>
                                    <input type="password" placeholder="Current Password" className="form-control" style={{ marginBottom: '1rem' }} />
                                    <input type="password" placeholder="New Password" className="form-control" style={{ marginBottom: '1rem' }} />
                                    <button className="btn-text" style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '500', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => toast.info('Password update simulation')}>Update Password</button>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="section-card" style={{ gridColumn: 'span 2' }}>
                            <div className="section-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                                    <h3 className="section-title">Profile Information</h3>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        id="profile-upload-input"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <div
                                        onClick={handleImageUploadClick}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            background: '#1F2937',
                                            border: imagePreview ? '2px solid #2563EB' : '1px dashed #4B5563',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: '#9CA3AF',
                                            transition: 'all 0.2s',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                        className="upload-placeholder"
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>Upload Photo</span>
                                            </>
                                        )}
                                        {imagePreview && (
                                            <div style={{ position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.5)', width: '100%', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px 0' }}>Change</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group">
                                        <label>Admin Name</label>
                                        <input type="text" name="adminName" value={config.adminName} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="text" name="adminPhone" value={config.adminPhone} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Gmail / Email Address</label>
                                        <input type="email" name="adminEmail" value={config.adminEmail} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                            <h4 style={{ color: '#EF4444', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>DANGER ZONE</h4>
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h5 style={{ color: '#EF4444', margin: '0 0 0.25rem 0' }}>Reset System Data</h5>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#EF4444', opacity: 0.8 }}>Permanently delete all configuration and start fresh. This cannot be undone.</p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    className="btn-danger-outline"
                                >
                                    Reset Data
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
