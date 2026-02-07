'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CheckCircle, Loader } from 'lucide-react';

export default function AuthSuccessPage() {
    const [status, setStatus] = useState('loading');
    const router = useRouter();

    useEffect(() => {
        const setupUser = async () => {
            try {
                // Fetch user data from JWT cookie
                const res = await fetch('/api/auth/me', {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                const data = await res.json();

                if (data.success && data.user) {
                    // Save to localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.dispatchEvent(new Event('user-updated'));

                    setStatus('success');
                    toast.success('Login successful!');

                    // Smart redirect: Check cart
                    setTimeout(() => {
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
                    }, 1500);
                } else {
                    setStatus('error');
                    toast.error('Failed to fetch user data');
                    setTimeout(() => router.push('/login'), 2000);
                }
            } catch (error) {
                console.error('Setup error:', error);
                setStatus('error');
                toast.error('Something went wrong');
                setTimeout(() => router.push('/login'), 2000);
            }
        };

        setupUser();
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%'
            }}>
                {status === 'loading' && (
                    <>
                        <Loader size={64} color="#667eea" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Verifying...</h2>
                        <p style={{ color: '#666' }}>Please wait while we set up your account</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Success!</h2>
                        <p style={{ color: '#666' }}>Redirecting you now...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
                        <h2 style={{ color: '#333', marginBottom: '10px' }}>Error</h2>
                        <p style={{ color: '#666' }}>Something went wrong. Redirecting to login...</p>
                    </>
                )}
            </div>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
