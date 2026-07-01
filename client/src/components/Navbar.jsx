import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';


const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/" className="nav-logo">ShopX</Link>
      
      <Link to="/">Home</Link>
      <Link to="/cart">Cart ({cartCount})</Link>

      <div className="nav-spacer" />

      {user ? (
        <>
          <span className="nav-user">Hi, <span className="nav-username">{user.name}</span></span>
          {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          <Link to="/my-orders">Orders</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;