import axios from 'axios';

const TOKEN_KEY = 'auth_token';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalid or expired - will be handled by AuthContext
            localStorage.removeItem(TOKEN_KEY);
            // Dispatch custom event for auth context to handle
            window.dispatchEvent(new CustomEvent('auth:unauthorized', {
                detail: error.response?.data?.message
            }));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
export { TOKEN_KEY };
