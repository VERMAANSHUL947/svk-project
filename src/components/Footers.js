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
            <div className="brand-logo">
              <Home />
              <h3>SVK Experts</h3>
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
        © 2026 SVK Experts. All Rights Reserved.
      </div>

    </footer>
  );
}
