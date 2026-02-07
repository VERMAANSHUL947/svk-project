'use client';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { Plus, Minus } from 'lucide-react';

export default function ServiceCard({ data, category }) {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  // Find if this item is already in cart
  const cartItem = cart.find(item => item.id === data.id);
  console.log('ServiceCard render: data.id=', data.id, 'cartItem=', cartItem, 'cart length=', cart.length);

  const handleAdd = () => {
    console.log('Add button clicked for:', data);
    if (!data.id) {
      console.error('Missing ID for service:', data);
      return;
    }
    try {
      addToCart({
        id: data.id,
        name: data.title,
        price: data.price,
        image: data.image || '/images/service-placeholder.png', // Fallback image
        category: category || 'General' // Store category
      });
      toast.success(`${data.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleIncrement = () => {
    updateQuantity(data.id, cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(data.id, cartItem.quantity - 1);
  };

  return (
    <div className="service-card">
      {/* Debug Info */}
      <div style={{ display: 'none' }}>{JSON.stringify(data)}</div>

      <div className="service-info">
        <h3>{data.title}</h3>
        <p className="price">Starts at ₹{data.price}</p>

        <ul>
          {data.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <a className="details">View details</a>
      </div>

      <div className="service-img">
        <img src={data.image || "/images/service-placeholder.png"} alt={data.title} />

        {cartItem ? (
          <div className="quantity-btn">
            <button onClick={handleDecrement}><Minus size={14} /></button>
            <span>{cartItem.quantity}</span>
            <button onClick={handleIncrement}><Plus size={14} /></button>
          </div>
        ) : (
          <button className="add-btn" onClick={handleAdd}>Add</button>
        )}

        <span>{data.options} options</span>
      </div>
    </div>
  );
}
