import axios from 'axios';

import { env } from '@/env';

import { getAccessToken, setStoredTokens, setStoredUser } from '@/auth';

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers.has('X-Without-Auth')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.delete('X-Without-Auth');
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error?.config?.url?.includes('/auth/token/');

    if (error?.response?.status === 401 && !isLoginRequest) {
      setStoredUser(null);
      setStoredTokens(null, null);
      window.location.href = '/admin/sign-in';
    }
  },
);

export default api;
