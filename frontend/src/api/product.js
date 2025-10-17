import api from "./axios";


// 🔹 Get Products
export const getProducts = async (token, filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);

    const response = await api.get(`/products/list-products.php?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // { status, products, count, page, limit }
  } catch (error) {
    console.error("Fetching products failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error fetching products." };
  }
};

// 🔹 Create Product (Admin)
export const createProduct = async (productData, token) => {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });

    const response = await api.post("/products/create-product.php", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Creating product failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error creating product." };
  }
};

// 🔹 Update Product (Admin)
export const updateProduct = async (productId, updateData, token) => {
  try {
    const response = await api.post("/products/update-product.php", {
      id: productId,
      ...updateData
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Updating product failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error updating product." };
  }
};

// 🔹 Delete Product (Admin)
export const deleteProduct = async (productId, token) => {
  try {
    const response = await api.post("/products/delete-product.php", {
      id: productId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Deleting product failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error deleting product." };
  }
}; 