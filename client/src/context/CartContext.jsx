import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCartCount(response.data.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);