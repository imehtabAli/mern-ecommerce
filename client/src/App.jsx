import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import ManageProducts from './pages/admin/ManageProducts';
import ProtectedRoute from './components/ProtectedRoute';
import ManageOrders from './pages/admin/ManageOrders';
import AdminDashboard from './pages/admin/AdminDashboard';
import Chatbot from './components/Chatbot';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer';
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <Chatbot />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><ManageProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><ManageOrders /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;