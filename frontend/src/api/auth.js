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

// 🔹 Get Cart Items
export const getCart = async (token) => {
  try {
    const response = await api.get("/carts/get-cart.php", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // { status, cart, total }
  } catch (error) {
    console.error("Fetching cart failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error fetching cart." };
  }
};

// 🔹 Update cart quantity (+1 or -1)
export const updateCart = async (cart_id, change, token) => {
  try {
    const res = await api.post(
      "/carts/update-cart.php",
      { cart_id, change },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Updating cart failed:", err.response?.data || err.message);
    throw err.response?.data || { message: "Server error updating cart." };
  }
};

// 🔹 Remove item from cart
export const removeCartItem = async (cart_id, token) => {
  try {
    const res = await api.post(
      "/carts/remove-cart.php",
      { cart_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Removing cart item failed:", err.response?.data || err.message);
    throw err.response?.data || { message: "Server error removing cart item." };
  }
};
