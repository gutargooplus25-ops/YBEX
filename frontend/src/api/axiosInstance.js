import axios from 'axios';

// Dynamically resolve API base URL:
// - On PC (localhost): use Vite proxy → '/api'
// - On mobile/other device (IP access): use same host IP with backend port 5000
function getBaseURL() {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== '/api') {
    if (!envUrl.endsWith('/api') && !envUrl.endsWith('/api/')) {
      envUrl = envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
    }
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
    if (isIP && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }
  return envUrl || '/api';
}

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — but NOT on login/auth endpoints
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
