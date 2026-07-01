import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axiosInstance.put('/users/update-profile', formData);

      const token = localStorage.getItem('token');
      login(response.data, token);

      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="page profile-page">
      <h2>My Profile</h2>
      <p>Manage your account information</p>
      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}
      <div className="profile-card">
        <div className="profile-card" style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Your User ID</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <code style={{
              background: 'var(--surface-2)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              flex: 1,
              wordBreak: 'break-all'
            }}>
              {user?.id || user?._id}
            </code>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(user?.id || user?._id);
                alert('ID copied!');
              }}
            >
              Copy
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Share this ID with admin to get elevated access
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '8px' }}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;