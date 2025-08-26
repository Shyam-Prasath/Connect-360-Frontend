import axios from "axios";

const api = axios.create({
  baseURL: "https://connect-360-backend.onrender.com/api",
});

// Always attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
