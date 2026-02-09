'use client';
import { Home, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import './Footer.css';

export default function Footers() {
  return (
    <footer className="footer">

      {/* CITIES STRIP */}
      <div className="cities-strip">
        <h4>Cities We Serve</h4>
        <p>
          Bengaluru | Hyderabad | Mumbai | Delhi NCR | Chennai | Pune | Ahmedabad | Kolkata | Jaipur | Surat | Lucknow |
          Indore | Coimbatore | Kochi | Nagpur | Vizag | Bhopal | Thiruvananthapuram | Chandigarh | Vadodara | Patna |
          Kanpur | Nashik | Mysore | Vijayawada | Ludhiana | Madurai | Rajkot | Guntur | Nellore | Warangal | Khammam
        </p>
      </div>

      {/* MAIN FOOTER */}
      <div className="footer-main">
        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-brand">
            <div className="brand-logo" style={{ marginBottom: '16px' }}>
              <img
                src="/urbanfixo-logo.png"
                alt="Urbanfixo - Home Services Simplified"
                style={{
                  height: '50px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #ff6b6b 0%, #f59e0b 25%, #fbbf24 50%, #10b981 75%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <div style="fontSize: 24px; color: white;">🏠</div>
                      </div>
                      <div style="display: flex; flex-direction: column; line-height: 1.2;">
                        <span style="fontSize: 24px; fontWeight: 800; color: #1e293b;">Urban<span style="color: #f59e0b;">fixo</span></span>
                        <span style="fontSize: 10px; color: #64748b; fontWeight: 600; letterSpacing: 0.5px; textTransform: uppercase;">Home Services Simplified</span>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            <p>
              Your trusted partner for all home services. From repairs to beauty,
              we bring expert solutions right to your doorstep.
            </p>

            <div className="social-icons">
              <Facebook />
              <Instagram />
              <Youtube />
              <Twitter />
            </div>
          </div>

          {/* COMPANY */}
          <div className="footer-column">
            <h4>Company</h4>
            <a>About Us</a>
            <a>Terms & Conditions</a>
            <a>Privacy Policy</a>
            <a>Contact Us</a>
          </div>

          {/* CUSTOMERS */}
          <div className="footer-column">
            <h4>For Customers</h4>
            <a>Services We Offer</a>
            <a>Reviews</a>
            <a>My Cart</a>
            <a>My Bookings</a>
          </div>

          {/* PROFESSIONALS */}
          <div className="footer-column">
            <h4>For Professionals</h4>
            <a>Join as Service Partner</a>
            <a>Partner Benefits</a>
            <a>Partner Guidelines</a>
          </div>

          {/* APP */}
          <div className="footer-column app">
            <h4>Download App</h4>
            <img src="/appstore.png" alt="App Store" />
            <img src="/playstore.png" alt="Play Store" />
          </div>


        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 Urbanfixo. All Rights Reserved.
      </div>

    </footer>
  );
}
