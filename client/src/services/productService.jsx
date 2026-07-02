import axiosInstance from '../api/axiosInstance';

export const getAllProducts = async (params = {}) => {
  const response = await axiosInstance.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};