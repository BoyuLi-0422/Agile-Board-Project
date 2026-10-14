import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

const axiosClient = {
  get: <T>(url: string): Promise<T> =>
    axiosInstance.get(url) as unknown as Promise<T>,

  post: <T>(url: string, data?: unknown): Promise<T> =>
    axiosInstance.post(url, data) as unknown as Promise<T>,

  put: <T>(url: string, data?: unknown): Promise<T> =>
    axiosInstance.put(url, data) as unknown as Promise<T>,

  delete: <T>(url: string): Promise<T> =>
    axiosInstance.delete(url) as unknown as Promise<T>,
};

export default axiosClient;