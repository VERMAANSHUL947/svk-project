'use client';

import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-wrapper">

        {/* LEFT SIDE */}
        <div className="hero-left">
          <div className="slider-box">
            Continuous Scrolling Slider
          </div>

          <div className="image-grid">
            <div className="img-box">Image</div>
            <div className="img-box">Image</div>
            <div className="img-box">Image</div>
            <div className="img-box">Image</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">

          <div className="search-title">
            What are you looking for?
          </div>

          <div className="service-table">
            <div>AC, Appliance & Repair</div>
            <div>Electrician, Plumber & Carpenter</div>
            <div>Cleaning, Pest Control & Safety</div>

            <div>Home Renovation & Interior</div>
            <div>Fabrication, Grills & Roofing</div>
            <div>Women’s Beauty & Spa</div>

            <div>Men’s Grooming & Massage</div>
            <div>Home Care, Support & Logistics</div>
            <div>Home Security, Solar & Water</div>
          </div>

          <div className="stats">
            <div>
              <h3>5</h3>
              <p>Service Rating</p>
            </div>
            <div>
              <h3>100K+</h3>
              <p>Happy SVK Customers</p>
            </div>
            <div>
              <h3>100K+</h3>
              <p>Experienced Experts</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
