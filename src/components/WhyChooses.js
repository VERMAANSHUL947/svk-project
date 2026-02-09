'use client';
import { Check, Flame, Shield, Zap } from 'lucide-react';
import './WhyChoose.css'
export default function WhyChooses() {
  return (
    <section className="why-choose">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">Why Choose Urbanfixo?</h3>
          <p className="section-subtitle">We're committed to providing the best service experience</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon green">
              <Check className="feature-icon-inner" />
            </div>
            <h4 className="feature-title">Verified Professionals</h4>
            <p className="feature-text">Thoroughly verified & trained</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">
              <Flame className="feature-icon-inner" />
            </div>
            <h4 className="feature-title">Transparent Pricing</h4>
            <p className="feature-text">Before booking</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <Shield className="feature-icon-inner" />
            </div>
            <h4 className="feature-title">Service Warranty</h4>
            <p className="feature-text">On all services</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Zap className="feature-icon-inner" />
            </div>
            <h4 className="feature-title">Quick Response</h4>
            <p className="feature-text">Guaranteed response time</p>
          </div>
        </div>
      </div>
    </section>
  );
}