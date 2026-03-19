import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(error),
);

export default axiosClient;
