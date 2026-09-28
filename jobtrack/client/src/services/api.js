import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send the HTTP-only auth cookie
  timeout: 60000, // free hosting can take a while to wake up
});

// If the session expires while using the app, tell the AuthContext
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.includes('/auth/')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// Turns any error into a friendly message for the UI
export const getErrorMessage = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.';
  }
  if (!error.response) {
    return 'Cannot reach the server. Check your internet connection and try again.';
  }
  return error.response.data?.message || 'Something went wrong. Please try again.';
};

// Field-level errors from the backend: { fieldName: 'message' }
export const getFieldErrors = (error) => {
  const list = error.response?.data?.errors;
  if (!Array.isArray(list)) return {};
  return list.reduce((acc, item) => {
    if (!acc[item.field]) acc[item.field] = item.message;
    return acc;
  }, {});
};

export default api;
