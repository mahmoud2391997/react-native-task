import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { AuthResponse, User, ProductsResponse, DeleteProductResponse } from '../types';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

export const productsApi = {
  getAllProducts: async (): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('/products?limit=100');
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  },

  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>(`/products/category/${category}`);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<DeleteProductResponse> => {
    const response = await api.delete<DeleteProductResponse>(`/products/${id}`);
    return response.data;
  },
};

export default api;
