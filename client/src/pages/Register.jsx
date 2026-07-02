import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(formData);
      login(data.user || { name: formData.name, email: formData.email }, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

return (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Create account</h2>
      <p>Join us today</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }}>Create Account</button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  </div>
);
};

export default Register;