import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const [address, setAddress] = useState({ address: '', city: '', pincode: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/orders/create-razorpay-order');
            console.log("Razorpay data from backend:", data);

            const options = {
                key: "rzp_test_T4spbPX9Pa5QbR",
                amount: data.amount,
                currency: data.currency,
                order_id: data.razorpayOrderId,
                name: "My Ecommerce Store",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axiosInstance.post('/orders/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            shippingAddress: address,
                        });
                        navigate('/my-orders');
                    } catch (err) {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.log(response.error);
            });

            razorpay.open();

        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
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

    return (
        <div className="page">
            <div className="checkout-page">
                <h2>Checkout</h2>
                <div className="checkout-card">
                    <h3>Shipping Address</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input name="address" style={inputStyle} placeholder="Street Address" value={address.address} onChange={handleChange} autoComplete="off" required />
                        <input name="city" style={inputStyle} placeholder="City" value={address.city} onChange={handleChange} autoComplete="off" required />
                        <input name="pincode" style={inputStyle} placeholder="Pincode" value={address.pincode} onChange={handleChange} autoComplete="off" required />
                        <input name="phone" style={inputStyle} placeholder="Phone Number" value={address.phone} onChange={handleChange} autoComplete="off" required />
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handlePayment}
                            disabled={loading}
                            style={{ marginTop: '8px' }}
                        >
                            {loading ? 'Processing...' : '🔒 Pay Securely'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;