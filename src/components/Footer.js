'use client';
import { Home, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

const cities = [
  'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune',
  'Ahmedabad', 'Kolkata', 'Jaipur', 'Surat', 'Lucknow', 'Indore',
  'Coimbatore', 'Kochi', 'Nagpur', 'Vizag', 'Bhopal', 'Thiruvananthapuram',
  'Chandigarh', 'Vadodara', 'Patna', 'Kanpur', 'Nashik', 'Mysore',
  'Vijayawada', 'Ludhiana', 'Madurai', 'Rajkot', 'Guntur', 'Nellore',
  'Warangal', 'Khammam', 'Karimnagar', 'Nizamabad', 'Mahbubnagar'
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* CITIES SECTION */}
      <div className="cities-section">
        <div className="cities-container">
          <h3>Cities We Serve</h3>
          <div className="cities-grid">
            {cities.map((city, index) => (
              <span key={index} className="city-name">{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="footer-main">
        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-brand">
            <div className="brand-logo">
              <Home size={28} />
              <h3>HomeFix</h3>
            </div>
            <p>
              Your one-stop destination for all home service needs. From cleaning to electrical
              works, we've got you covered with verified professionals.
            </p>

            <div className="social-icons">
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
            </div>
          </div>

          {/* COMPANY */}
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cities We Serve</a>
          </div>

          {/* CUSTOMERS */}
          <div className="footer-column">
            <h4>For Customers</h4>
            <a href="#">Reviews</a>
            <a href="#">Contact Us</a>
            <a href="#">Services We Offer</a>
          </div>

          {/* PROFESSIONALS */}
          <div className="footer-column">
            <h4>For Professionals</h4>
            <a href="#">Join as a Service Partner</a>
          </div>

          {/* SOCIAL MEDIA & APP DOWNLOAD */}
          <div className="footer-column footer-apps">
            <h4>Social Media</h4>
            <div className="social-icons-footer">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="YouTube">▶</a>
              <a href="#" aria-label="Email">✉</a>
            </div>
            <div className="app-buttons">
              <a href="#" className="app-button app-store">
                <span className="app-icon">🍎</span>
                <div className="app-text">
                  <span className="app-small">Download on the</span>
                  <span className="app-large">App Store</span>
                </div>
              </a>
              <a href="#" className="app-button google-play">
                <span className="app-icon">▶</span>
                <div className="app-text">
                  <span className="app-small">GET IT ON</span>
                  <span className="app-large">Google Play</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 HOMEZO | ALL RIGHTS RESERVED
      </div>

    </footer>
  );
}
