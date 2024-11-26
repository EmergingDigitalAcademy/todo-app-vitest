import axios from 'axios';

// Add default config
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add interceptors for error handling if needed
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axios; 