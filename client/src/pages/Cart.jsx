import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCart(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.put(`/cart/${productId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="page cart-page">
      <h2>Your Cart</h2>
      {cart.items.map((item) => (
        <div key={item._id} className="cart-item">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="cart-item-img"
          />
          <div className="cart-item-info">
            <p className="cart-item-name">{item.product.name}</p>
            <p className="cart-item-price">₹{item.product.price.toLocaleString('en-IN')}</p>
          </div>
          <div className="cart-item-controls">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleUpdateQuantity(item.product._id, Number(e.target.value))}
            />
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleRemove(item.product._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="cart-total">
          <span className="cart-total-label">Total Amount</span>
          <span className="cart-total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/checkout')}
          style={{ width: '100%', marginTop: '16px' }}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;