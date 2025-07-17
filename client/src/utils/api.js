// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // update to your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
