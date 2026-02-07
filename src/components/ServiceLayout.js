'use client';
import { useCart } from '@/context/CartContext';
import Sidebar from './Sidebar';
import ServiceCard from './ServiceCard';
import '../app/styles/service.css';

export default function ServiceLayout({ title, services }) {
  const { cart, getCartTotal } = useCart();
  const cartTotal = getCartTotal();
  const hasItems = cart.length > 0;

  return (
    <div className="service-page">

      {/* LEFT */}
      <Sidebar title={title} />

      {/* CENTER */}
      <div className="service-list">
        <h2>Apartment / Bunglow</h2>

        {services.map((item, index) => (
          <ServiceCard key={index} data={item} category={title} />
        ))}
      </div>

      {/* RIGHT */}
      <div className="service-cart">
        <div className="cart-box">
          <div className="cart-icon-wrapper">
            🛒
          </div>

          {hasItems ? (
            <div className="mini-cart-summary">
              <strong>{cart.length} items in cart</strong>
              <p className="cart-total">Total: ₹{cartTotal}</p>
              <button className="view-cart-btn">View Cart</button>
            </div>
          ) : (
            <p>No items in your cart</p>
          )}
        </div>

        <div className="promise-box">
          <h3>UC Promise</h3>
          <ul>
            <li>✔ Verified Professionals</li>
            <li>✔ Hassle Free Booking</li>
            <li>✔ Transparent Pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
