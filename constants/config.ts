export const API_BASE_URL = 'https://dummyjson.com';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PRODUCTS: {
    ALL: '/products',
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    DELETE: (id: number) => `/products/${id}`,
  },
};

export const SUPERADMIN_USERNAME = 'emilys';

export const CHOSEN_CATEGORY = 'laptops';

export const AUTO_LOCK_TIMEOUT = 10000;
