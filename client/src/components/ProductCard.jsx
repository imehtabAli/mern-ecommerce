import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="product-card">
        <img
          src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={product.name}
          className="product-card-img"
        />
        <div className="product-card-body">
          <p className="product-card-name">{product.name}</p>
          <p className="product-card-price">₹{product.price.toLocaleString('en-IN')}</p>
          {product.stock === 0 && <p className="product-card-stock-out">Out of Stock</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;