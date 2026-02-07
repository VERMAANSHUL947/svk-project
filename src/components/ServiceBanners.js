'use client';
import './ServiceBanners.css';

export default function ServiceBanners() {
    return (
        <section className="service-banners">
            {/* Professional Cleaning Banner */}
            <div className="banner cleaning-banner">
                <div className="banner-content">
                    <h2>Professional Cleaning</h2>
                    <p>Get your home serviced and spotless with our expert deep cleaning services. Eco-friendly products and certified professionals.</p>
                    <div className="banner-tags">
                        <span>Cockroach Control</span>
                        <span>Bed Bug Treatment</span>
                        <span>Mosquito Mesh</span>
                    </div>
                    <button className="banner-button">Book Now</button>
                </div>
                <div className="banner-decoration">
                    <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop" alt="Professional Cleaning" />
                </div>
            </div>

            {/* Men's Grooming Banner */}
            <div className="banner grooming-banner">
                <div className="banner-content">
                    <h2>Men's Grooming & Massage</h2>
                    <p>Luxury salon experience at home. Expert stylists and professional massage therapists at your service.</p>
                    <div className="banner-tags">
                        <span>Hair & Styling</span>
                        <span>Facial & Skincare</span>
                        <span>Body Spa</span>
                    </div>
                    <button className="banner-button">Book Now</button>
                </div>
                <div className="banner-image">
                    <img src="/grooming-man.jpg" alt="Men's Grooming" />
                </div>
            </div>
        </section>
    );
}
