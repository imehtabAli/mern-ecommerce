import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Electronics', 'Audio', 'Laptops', 'Footwear', 'Clothing', 'Accessories', 'Home Appliances', 'Cameras'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const LIMIT = 8;

  // AI Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await axiosInstance.get('/products', { params });
      setProducts(response.data.products);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearchMode) {
      fetchProducts(1);
    }
  }, [category, minPrice, maxPrice]);

  useEffect(() => {
    if (!isSearchMode) {
      fetchProducts(currentPage);
    }
  }, [currentPage]);

  const handleSmartSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setIsSearchMode(true);
    try {
      const response = await axiosInstance.post('/ai/smart-search', { query: searchQuery });
      setProducts(response.data);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setCurrentPage(1);
    setIsSearchMode(false);
  };

  return (
    <div className="page">
      <div className="home-hero">
        <h1>Shop <span>Everything</span></h1>
        <p>Discover thousands of products at unbeatable prices</p>
      </div>

      <form className="search-bar" onSubmit={handleSmartSearch}>
        <input
          type="text"
          placeholder="Try: 'comfortable shoes for running'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={searching}>
          {searching ? 'Searching...' : '✨ AI Search'}
        </button>
        {isSearchMode && (
          <button className="btn btn-secondary" type="button" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {!isSearchMode && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`btn btn-sm ${(cat === 'All' && !category) || cat === category ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', maxWidth: '400px' }}>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
              style={{ flex: 1 }}
            />
            <span style={{ color: 'var(--text-muted)' }}>—</span>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
              style={{ flex: 1 }}
            />
            {(minPrice || maxPrice) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setMinPrice(''); setMaxPrice(''); setCurrentPage(1); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {!isSearchMode && (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
          Showing {products.length} of {totalProducts} products
        </p>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="alert alert-error">{error}</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try different filters or search query</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!isSearchMode && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;