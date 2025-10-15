// axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/Ecommerce-Project/backend/",
  withCredentials: true, // include cookies for auth/session
});

// Optional: global interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
