import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const data = await loginUser(formData);
      login(data.user || { email: formData.email }, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

return (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Welcome back</h2>
      <p>Login to your account</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      <div className="auth-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  </div>
);
};

export default Login;