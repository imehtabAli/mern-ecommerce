import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="page orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-card-header">
            <div>
              <p className="order-id">#{order._id}</p>
              <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className={`order-status-badge badge-${order.paymentStatus}`}>
                {order.paymentStatus}
              </span>
              <span className={`order-status-badge badge-${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item._id} className="order-item-row">
                <span>{item.product?.name || 'Product unavailable'} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>

          <div className="order-total-row">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;