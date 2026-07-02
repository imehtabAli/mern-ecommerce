import axiosInstance from '../api/axiosInstance';

export const createRazorpayOrder = async () => {
  const response = await axiosInstance.post('/orders/create-razorpay-order');
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axiosInstance.post('/orders/verify', paymentData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get('/orders/my-orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};
