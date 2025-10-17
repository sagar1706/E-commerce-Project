// auth.js
import api from "./axios";

// 🔹 User Login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login.php", { email, password });
    return response.data; // Expected: { success: true, token, user }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error during login." };
  }
};

// 🔹 User Registration
export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register.php", { name, email, password });
    return response.data; // Expected: { success: true, message }
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error during registration." };
  }
};

// 🔹 User Logout (Optional — if backend supports session or token invalidation)
export const logoutUser = async () => {
  try {
    const response = await api.post("/logout.php");
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error during logout." };
  }
};





