import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', stock: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [generatingDesc, setGeneratingDesc] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/products');
            setProducts(response.data.products);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.category) {
            alert('Please enter Name and Category first.');
            return;
        }
        setGeneratingDesc(true);
        try {
            const response = await axiosInstance.post('/ai/generate-description', {
                name: formData.name,
                category: formData.category,
            });
            setFormData({ ...formData, description: response.data.description });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to generate description.');
        } finally {
            setGeneratingDesc(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingId) {
                await axiosInstance.put(`/products/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setMessage('Product updated!');
            } else {
                await axiosInstance.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setMessage('Product created!');
            }

            setFormData({ name: '', description: '', price: '', category: '', stock: '' });
            setImageFile(null);
            setEditingId(null);
            fetchProducts();

        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong.');
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axiosInstance.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed.');
        }
    };


    const inputStyle = {
        background: '#1a1a1a',
        color: '#f0f0f0',
        border: '1px solid #2a2a2a',
        padding: '10px 14px',
        borderRadius: '6px',
        fontSize: '14px',
        width: '100%',
        outline: 'none',
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page admin-page">
            <h2>Manage Products</h2>

            <div className="admin-form">
                <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                {message && (
                    <div className={`alert ${message.includes('success') || message.includes('created') || message.includes('updated') ? 'alert-success' : 'alert-error'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input name="name" style={inputStyle} placeholder="Product Name" value={formData.name} onChange={handleChange} required />
                        <input name="category" style={inputStyle} placeholder="Category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required rows={3} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleGenerateDescription} disabled={generatingDesc}>
                        {generatingDesc ? 'Generating...' : '✨ Generate with AI'}
                    </button>
                    <div className="form-row">
                        <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required />
                        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Product' : 'Create Product'}
                        </button>
                        {editingId && (
                            <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', description: '', price: '', category: '', stock: '' }); }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>All Products</h3>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img src={product.image} alt={product.name} className="admin-product-img" />
                                </td>
                                <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{product.name}</td>
                                <td>{product.category}</td>
                                <td style={{ color: 'var(--accent)', fontWeight: '600' }}>₹{product.price.toLocaleString('en-IN')}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <div className="admin-actions">
                                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;