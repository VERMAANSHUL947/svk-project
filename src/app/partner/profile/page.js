'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaShieldAlt, FaLock, FaClock, FaCamera, FaSpinner, FaChevronLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './profile.css';

export default function PartnerProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        secondaryEmail: '',
        timezone: 'UTC+05:30 (India Standard Time)',
        language: 'English (US)',
        currentPassword: '',
        twoFactor: false,
        profileImage: '',
        partnerId: '',
        joinedDate: ''
    });

    // Backup state for discard
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/partner/me');
            const data = await res.json();

            if (data.success) {
                const p = data.partner;
                const mappedData = {
                    fullName: p.fullName || '',
                    email: p.email || '',
                    phoneNumber: p.phoneNumber || '',
                    secondaryEmail: p.secondaryEmail || '',
                    timezone: p.timezone || 'UTC+05:30 (India Standard Time)',
                    language: p.language || 'English (US)',
                    twoFactor: false, // Default for now
                    profileImage: p.profileImage || '',
                    partnerId: p._id ? `PARTNER-${p._id.substring(p._id.length - 6).toUpperCase()}` : 'ID-Unknown',
                    joinedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'
                };
                setFormData(mappedData);
                setOriginalData(mappedData);
            } else {
                toast.error('Failed to load profile: ' + data.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Network error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/partner/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    secondaryEmail: formData.secondaryEmail,
                    timezone: formData.timezone,
                    language: formData.language,
                    profileImage: formData.profileImage
                })
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Profile updated successfully!');
                setOriginalData(formData); // Update backup
                // Optionally update context or trigger re-fetch if needed
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        if (originalData) {
            setFormData(originalData);
            toast.info('Changes discarded');
        }
    };

    const handleBack = () => {
        router.push('/partner/dashboard');
    };

    // Helper to focus input when Edit is clicked
    const focusInput = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.focus();
            toast.info(`Editing ${id.replace('input-', '')}`, { autoClose: 1000, hideProgressBar: true });
        }
    };

    if (loading) {
        return (
            <div className="profile-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaSpinner className="spin" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', color: '#2563EB' }} />
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <ToastContainer position="top-right" />

            <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>
                <FaChevronLeft /> Back to Dashboard
            </button>

            {/* HEADER */}
            <header className="profile-header">
                <div className="avatar-container">
                    <img
                        src={formData.profileImage || "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"}
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <div className="edit-avatar-btn">
                        <FaCamera />
                    </div>
                </div>
                <h1 className="profile-name">{formData.fullName || 'Partner Name'}</h1>
                <div className="profile-role">Senior Service Partner</div>
                <div className="profile-meta">
                    {formData.partnerId} • Joined {formData.joinedDate}
                </div>
            </header>

            {/* PERSONAL DETAILS */}
            <section className="profile-card">
                <div className="card-header">
                    <div className="card-title">
                        <FaUser style={{ color: '#2563EB' }} /> Personal Details
                    </div>
                    <div className="card-action-link" onClick={() => focusInput('input-Full Name')}>Edit All</div>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaUser /></div>
                        <div className="field-info">
                            <h5>FULL NAME</h5>
                            <input
                                id="input-Full Name"
                                className="field-input"
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="field-action-btn" onClick={() => focusInput('input-Full Name')}>Edit</button>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaEnvelope /></div>
                        <div className="field-info">
                            <h5>EMAIL ADDRESS</h5>
                            <input
                                id="input-Email"
                                className="field-input"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="field-action-btn" onClick={() => focusInput('input-Email')}>Edit</button>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaPhone /></div>
                        <div className="field-info">
                            <h5>PHONE NUMBER</h5>
                            <input
                                id="input-Phone"
                                className="field-input"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="field-action-btn" onClick={() => focusInput('input-Phone')}>Edit</button>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaGlobe /></div>
                        <div className="field-info">
                            <h5>SECONDARY EMAIL / ID</h5>
                            <input
                                id="input-SecEmail"
                                className="field-input"
                                value={formData.secondaryEmail}
                                placeholder="Add secondary email..."
                                onChange={(e) => handleChange('secondaryEmail', e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="field-action-btn" onClick={() => focusInput('input-SecEmail')}>Edit</button>
                </div>
            </section>

            {/* SECURITY & PRIVACY */}
            <section className="profile-card">
                <div className="card-header">
                    <div className="card-title">
                        <FaShieldAlt style={{ color: '#2563EB' }} /> Security & Privacy
                    </div>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaLock /></div>
                        <div className="field-info">
                            <h5>PASSWORD</h5>
                            <div style={{ fontSize: '1.2rem', letterSpacing: '2px', lineHeight: '1' }}>••••••••••••</div>
                        </div>
                    </div>
                    <button className="field-action-btn primary">Change Password</button>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaShieldAlt /></div>
                        <div className="field-info">
                            <h5>TWO-FACTOR AUTHENTICATION</h5>
                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Keep your account secure by requiring a code</div>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={formData.twoFactor}
                            onChange={(e) => handleChange('twoFactor', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </section>

            {/* ACCOUNT SETTINGS */}
            <section className="profile-card">
                <div className="card-header">
                    <div className="card-title">
                        <FaUser style={{ color: '#2563EB' }} /> Account Settings
                    </div>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaClock /></div>
                        <div className="field-info">
                            <h5>TIMEZONE</h5>
                            <select
                                className="field-input"
                                value={formData.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                style={{ background: 'transparent' }}
                            >
                                <option>UTC+05:30 (India Standard Time)</option>
                                <option>UTC-08:00 (Pacific Time)</option>
                                <option>UTC-05:00 (Eastern Time)</option>
                                <option>UTC+00:00 (London, UK)</option>
                            </select>
                        </div>
                    </div>
                    <button className="field-action-btn">Change</button>
                </div>

                <div className="profile-field-row">
                    <div className="field-label">
                        <div className="field-icon"><FaGlobe /></div>
                        <div className="field-info">
                            <h5>LANGUAGE PREFERENCE</h5>
                            <select
                                className="field-input"
                                value={formData.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                                style={{ background: 'transparent' }}
                            >
                                <option>English (US)</option>
                                <option>English (UK)</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                    </div>
                    <button className="field-action-btn">Change</button>
                </div>
            </section>

            {/* FOOTER ACTIONS */}
            <div className="profile-footer">
                <button className="btn-discard" onClick={handleDiscard} disabled={saving}>Discard Changes</button>
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
}
