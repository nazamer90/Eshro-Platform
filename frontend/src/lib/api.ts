import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData),
};

export const storesAPI = {
  getAll: (params?: any) =>
    api.get('/stores', { params }),
  
  getById: (id: number) =>
    api.get(`/stores/${id}`),
  
  create: (storeData: any) =>
    api.post('/stores', storeData),
  
  update: (id: number, storeData: any) =>
    api.put(`/stores/${id}`, storeData),
  
  delete: (id: number) =>
    api.delete(`/stores/${id}`),
  
  getProducts: (id: number, params?: any) =>
    api.get(`/stores/${id}/products`, { params }),
};

export const productsAPI = {
  getAll: (params?: any) =>
    api.get('/products', { params }),
  
  getById: (id: number) =>
    api.get(`/products/${id}`),
  
  create: (productData: any) =>
    api.post('/products', productData),
  
  update: (id: number, productData: any) =>
    api.put(`/products/${id}`, productData),
  
  delete: (id: number) =>
    api.delete(`/products/${id}`),
  
  search: (query: string, params?: any) =>
    api.get('/products/search', { params: { q: query, ...params } }),
  
  getReviews: (id: number) =>
    api.get(`/products/${id}/reviews`),
  
  addReview: (id: number, reviewData: any) =>
    api.post(`/products/${id}/reviews`, reviewData),
};

export const ordersAPI = {
  getAll: (params?: any) =>
    api.get('/orders', { params }),
  
  getById: (id: number) =>
    api.get(`/orders/${id}`),
  
  create: (orderData: any) =>
    api.post('/orders', orderData),
  
  updateStatus: (id: number, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
  
  cancel: (id: number) =>
    api.put(`/orders/${id}/cancel`),
};

export const adminAPI = {
  getStats: () =>
    api.get('/admin/stats'),
  
  getUsers: (params?: any) =>
    api.get('/admin/users', { params }),
  
  updateUser: (id: number, userData: any) =>
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
  
  getStores: (params?: any) =>
    api.get('/admin/stores', { params }),
  
  approveStore: (id: number) =>
    api.put(`/admin/stores/${id}/approve`),
  
  rejectStore: (id: number) =>
    api.put(`/admin/stores/${id}/reject`),
  
  getOrders: (params?: any) =>
    api.get('/admin/orders', { params }),
};

export const merchantAPI = {
  getStats: () =>
    api.get('/merchant/stats'),
  
  getOrders: (params?: any) =>
    api.get('/merchant/orders', { params }),
  
  updateOrderStatus: (id: number, status: string) =>
    api.put(`/merchant/orders/${id}/status`, { status }),
  
  getProducts: (params?: any) =>
    api.get('/merchant/products', { params }),
  
  createProduct: (productData: any) =>
    api.post('/merchant/products', productData),
  
  updateProduct: (id: number, productData: any) =>
    api.put(`/merchant/products/${id}`, productData),
  
  deleteProduct: (id: number) =>
    api.delete(`/merchant/products/${id}`),
};

export default api;