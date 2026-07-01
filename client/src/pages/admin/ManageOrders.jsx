import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders/all');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page admin-page">
      <h2>Manage Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-manage-card">
          <div className="order-card-header">
            <div>
              <p className="order-id">#{order._id}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Customer: <strong>{order.user?.name || order.user?.email || 'Unknown'}</strong>
              </p>
              <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', marginTop: '4px' }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span className={`order-status-badge badge-${order.paymentStatus}`}>
                {order.paymentStatus}
              </span>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageOrders;