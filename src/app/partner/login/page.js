'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import '../../admin/admin-login.css'; // Reusing the premium style

export default function PartnerLogin() {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const router = useRouter();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let apiUrl = '';
            let body = {};

            if (loginMethod === 'phone') {
                apiUrl = '/api/partner/login/send-otp';
                body = { phoneNumber };
            } else {
                apiUrl = '/api/auth/email/send-otp';
                body = { email, type: 'login', userType: 'partner' };
            }

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                setStep(2);
                startResendTimer();
                toast.success(`OTP Sent to ${loginMethod === 'phone' ? 'Phone' : 'Email'}!`);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter complete OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let apiUrl = '';
            let body = {};

            if (loginMethod === 'phone') {
                apiUrl = '/api/partner/verify-otp';
                body = { phoneNumber, otp: otpCode };
            } else {
                apiUrl = '/api/auth/email/verify-otp';
                body = { email, otp: otpCode, type: 'login', userType: 'partner' };
            }

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Login Successful!');
                router.push('/partner/dashboard');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="admin-container">
            <div className="admin-left">
                <div className="lock-visual-container">
                    <div className="lock-glow" style={{ background: '#10B981', opacity: 0.1 }}></div>
                    <div className="lock-illustration">
                        <svg className="lock-body-svg" viewBox="0 0 24 24" style={{ stroke: '#064E3B' }}>
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <div className="lock-core" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.1)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#10B981">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h2 className="left-title">Partner Portal</h2>
                <p className="left-subtitle">Manage your service business, track earnings, and deliver excellence with our professional toolkit.</p>
            </div>

            <div className="admin-right">
                {step === 1 ? (
                    <div className="login-form-container">
                        <h1 className="form-title">Partner Login</h1>
                        <p className="form-subtitle">Enter your details for quick OTP access to your workspace.</p>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleSendOTP}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('email')}
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #1F2937', background: loginMethod === 'email' ? '#111827' : 'transparent', color: loginMethod === 'email' ? '#2563EB' : '#64748B', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('phone')}
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #1F2937', background: loginMethod === 'phone' ? '#111827' : 'transparent', color: loginMethod === 'phone' ? '#2563EB' : '#64748B', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Phone
                                </button>
                            </div>

                            {loginMethod === 'email' ? (
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="email"
                                            placeholder="partner@business.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <div className="input-field-wrapper phone-field-wrapper">
                                        <div className="country-selector">+91 <span>▾</span></div>
                                        <input
                                            type="tel"
                                            placeholder="98765 43210"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="get-otp-btn" disabled={loading}>
                                {loading ? 'Sending...' : 'Get OTP Code →'}
                            </button>

                            <div className="verify-info-box">
                                <div className="info-icon" style={{ background: '#10B981' }}>✓</div>
                                <div className="info-content">
                                    <h4>Instant Access</h4>
                                    <p>Secure login via one-time passcodes. No passwords required.</p>
                                </div>
                            </div>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                                New Partner? <a href="/partner/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}>Apply Now</a>
                            </p>
                        </div>

                        <div className="encrypted-footer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
                            </svg>
                            PARTNER SECURITY 2.0
                        </div>
                    </div>
                ) : (
                    <div className="login-form-container otp-form-container">
                        <button className="back-btn" onClick={() => setStep(1)} type="button" style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            ← Back to Login
                        </button>

                        <h1 className="form-title" style={{ fontSize: '1.75rem' }}>OTP Verification</h1>
                        <p className="form-subtitle">Code sent to {loginMethod === 'phone' ? phoneNumber : email}</p>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleVerifyOTP}>
                            <div className="otp-box-grid">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                        disabled={loading}
                                        className="digit-input"
                                    />
                                ))}
                            </div>

                            <button type="submit" className="get-otp-btn" disabled={loading} style={{ background: '#10B981' }}>
                                {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                            </button>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                {resendTimer > 0 ? (
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Resend in <span style={{ color: '#fff' }}>{resendTimer}s</span></p>
                                ) : (
                                    <button type="button" onClick={handleSendOTP} style={{ background: 'none', border: 'none', color: '#10B981', fontWeight: '600', cursor: 'pointer' }}>
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
