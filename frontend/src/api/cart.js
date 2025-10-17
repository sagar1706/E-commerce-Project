import api from "./axios";

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