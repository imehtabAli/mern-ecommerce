import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { fetchCartCount } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart', { productId: id, quantity });
      setMessage('Added to cart!');
      await fetchCartCount();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

return (
  <div className="page">
    <div className="product-detail">
      <img
        src={product.image || 'https://via.placeholder.com/400'}
        alt={product.name}
        className="product-detail-img"
      />
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-detail-price">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="product-detail-desc">{product.description}</p>
        <p className="product-detail-stock">
          Stock: <span>{product.stock} available</span>
        </p>

        <div className="quantity-row">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('Added') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default ProductDetail;