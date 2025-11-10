import axios from 'axios';
import { env } from '@/env';

import { setStoredUser } from '@/auth';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

export default api;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      setStoredUser(null);
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  },
);
