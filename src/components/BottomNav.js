'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import './BottomNav.css';

const BottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    // Hide on partner routes
    if (pathname && pathname.startsWith('/partner')) return null;

    const tabs = [
        { label: 'Home', icon: <Home size={20} />, path: '/' },
        { label: 'Bookings', icon: <ShoppingBag size={20} />, path: '/bookings' },
        { label: 'Profile', icon: <User size={20} />, path: '/profile' },
        { label: 'Cart', icon: <ShoppingCart size={20} />, path: '/cart', badge: cartCount }
    ];

    return (
        <nav className="bottom-nav">
            {tabs.map((tab) => (
                <div
                    key={tab.path}
                    className={`nav-tab ${pathname === tab.path ? 'active' : ''}`}
                    onClick={() => router.push(tab.path)}
                >
                    <div className="tab-icon-wrapper">
                        {tab.icon}
                        {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
                    </div>
                    <span className="tab-label">{tab.label}</span>
                </div>
            ))}
        </nav>
    );
};

export default BottomNav;
