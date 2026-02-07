'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Mail, ArrowRight, Home, Lock } from 'lucide-react';
import '../auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type: 'login',
          userType: 'user'
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('OTP sent to your email!');
        setStep(2);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error('Something went wrong. Please try again.');
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
          email,
          otp,
          type: 'login',
          userType: 'user'
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log('✅ Login successful');

        // Save user data to localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('user-updated'));
        }

        toast.success('Login successful!');

        // Smart redirect
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          router.push(callbackUrl);
          return;
        }

        // Check cart
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          try {
            const cart = JSON.parse(cartData);
            if (cart && cart.length > 0) {
              router.push('/cart');
              return;
            }
          } catch (e) {
            console.error('Cart parse error:', e);
          }
        }

        router.push('/profile');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-split">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="brand-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-box">
            <Home size={20} color="white" />
          </div>
          <span>HomeServices</span>
        </div>

        <div className="left-content">
          <h1 className="left-title">Find the perfect help for your home.</h1>
          <p className="left-subtitle">Join thousands of homeowners who trust our marketplace for quality repairs, cleaning, and maintenance.</p>

          <div className="trusted-badge">
            <div className="avatars">
              <img src="https://i.pravatar.cc/150?u=1" alt="u1" />
              <img src="https://i.pravatar.cc/150?u=2" alt="u2" />
              <img src="https://i.pravatar.cc/150?u=3" alt="u3" />
            </div>
            <span className="trusted-text">Trusted by 10k+ homeowners</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="auth-form-card">
          <div className="auth-header">
            <h1>{step === 1 ? 'Welcome back' : 'Verify OTP'}</h1>
            <p>{step === 1 ? 'Enter your email to continue' : `We sent a code to ${email}`}</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-main-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'} <ArrowRight size={18} />
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
                {loading ? 'Verifying...' : 'Verify & Login'} <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="auth-main-btn"
                style={{ marginTop: '10px', background: '#6b7280' }}
              >
                Change Email
              </button>
            </form>
          )}

          <p className="auth-footer" style={{ marginTop: '20px' }}>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>

          <p className="auth-footer" style={{ marginTop: '10px', fontSize: '0.85rem', color: '#666' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
