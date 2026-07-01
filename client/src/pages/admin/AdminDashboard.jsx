import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/users/${userId}/make-admin`);
      setMessage('User promoted to admin successfully!');
      setUserId('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to promote user.');
    }
  };

  return (
    <div className="page admin-page">
      <h2>Admin Dashboard</h2>
      <div className="admin-dashboard-links">
        <Link to="/admin/products" className="admin-dashboard-link-card">
          <h3>📦 Manage Products</h3>
          <p>Add, edit, or delete products</p>
        </Link>
        <Link to="/admin/orders" className="admin-dashboard-link-card">
          <h3>🛒 Manage Orders</h3>
          <p>View and update order statuses</p>
        </Link>
      </div>

      <div className="admin-form" style={{ marginTop: '32px', maxWidth: '500px' }}>
        <h3>Promote User to Admin</h3>
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleMakeAdmin}>
          <input
            type="text"
            placeholder="Enter User ID (MongoDB ObjectId)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit" style={{ marginTop: '10px' }}>
            Make Admin
          </button>
        </form>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
         Get User ID from MongoDB Compass or `/api/users/profile` endpoint.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;