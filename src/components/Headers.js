'use client';
import { Search, MapPin, ShoppingCart } from 'lucide-react';
import './Header.css';

export default function Headers() {
  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo">
          <img src="/images/logo.png" alt="SVK Experts" />
          <div>
            <h2>SVK</h2>
            <span>Experts</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Search for services..." />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="header-actions">
          <button className="location-btn">
            <MapPin size={16} />
            Use Current Location
          </button>

          <button className="partner-btn">
            🤝 Join as Partner
          </button>

          <div className="cart">
            <ShoppingCart size={18} />
          </div>
        </div>

      </div>
    </header>
  );
}
