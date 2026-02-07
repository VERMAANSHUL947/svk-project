'use client';
import '../app/styles/service.css';

export default function ServiceModal({ service, onClose }) {
  if (!service) return null;

  return (
    <div className="service-overlay">
      <div className="service-modal">

        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <img src="/service.jpg" alt="service" />

          <div>
            <div className="modal-title">{service.title}</div>
            <div className="modal-rating">⭐ 4.7 (1.8M reviews)</div>
            <div className="modal-fast">We’ll arrive in 10 mins</div>
          </div>
        </div>

        <div className="time-grid">
          {[1, 1.5, 2, 4].map((h) => (
            <div className="time-card" key={h}>
              <h4>{h} hour</h4>
              <p>⭐ 4.7</p>
              <div className="time-price">₹{service.price}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
