'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Tag, ArrowRight, Home, Lock } from 'lucide-react';
import '../auth.css';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        referralCode: ''
    });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Form, 2: OTP
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!agree) {
            toast.warning('Please agree to the Terms and Conditions');
            return;
        }

        setLoading(true);
        try {
            // First create user account
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                // Then send OTP
                const otpRes = await fetch('/api/auth/email/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        type: 'register',
                        userType: 'user'
                    }),
                });

                const otpData = await otpRes.json();

                if (otpRes.ok) {
                    toast.success('Account created! Please verify your email.');
                    setStep(2);
                } else {
                    toast.error(otpData.message || 'Failed to send OTP');
                }
            } else {
                toast.error(data.message || 'Signup failed');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/email/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp,
                    type: 'register',
                    userType: 'user'
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Email verified successfully!');

                // Save user data
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.dispatchEvent(new Event('user-updated'));
                }

                // Smart redirect based on cart
                const cartData = localStorage.getItem('cart');
                let redirectUrl = '/profile';
                if (cartData) {
                    try {
                        const cart = JSON.parse(cartData);
                        if (cart && cart.length > 0) {
                            redirectUrl = '/cart';
                        }
                    } catch (e) {
                        console.error('Cart parse error:', e);
                    }
                }
                router.push(redirectUrl);
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page signup-page">
            <div className="brand-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer', position: 'absolute', top: '30px', left: '30px' }}>
                <div className="logo-box">
                    <Home size={20} color="black" />
                </div>
                <span style={{ color: '#000' }}>HomeServices</span>
            </div>

            <div className="signup-card">
                <div className="signup-header">
                    <h1>{step === 1 ? 'Create Your Account' : 'Verify Your Email'}</h1>
                    <p>{step === 1 ? 'Start booking reliable home services today' : `We sent a code to ${formData.email}`}</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSignup}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    className="auth-input"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    className="auth-input"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Phone Number</label>
                            <div className="input-wrapper">
                                <Phone className="input-icon" size={20} />
                                <input
                                    type="tel"
                                    name="phone"
                                    className="auth-input"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label className="input-label">Referral Code</label>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Optional</span>
                            </div>
                            <div className="input-wrapper">
                                <Tag className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="referralCode"
                                    className="auth-input"
                                    placeholder="Enter code"
                                    style={{ borderStyle: 'dotted' }}
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                            <label>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                        </div>

                        <button type="submit" className="auth-main-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Create Account'} <ArrowRight size={18} />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="input-group">
                            <label className="input-label">Enter OTP</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-main-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="auth-main-btn"
                            style={{ marginTop: '10px', background: '#6b7280' }}
                        >
                            Back to Signup
                        </button>
                    </form>
                )}

                <div className="signup-footer-info">
                    <span>🛡️ SECURE & ENCRYPTED</span>
                    <span>✅ VERIFIED PROS</span>
                </div>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}
