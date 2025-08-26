import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
