import axios from 'axios';
import { env } from '@/env';

import { setStoredUser } from '@/auth';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error?.config?.url?.includes('/auth/sign-in');

    if (error?.response?.status === 401 && !isLoginRequest) {
      setStoredUser(null);
      window.location.href = '/admin/sign-in';
    }
    return Promise.reject(error);
  },
);

export default api;
