import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

const CreateProduct = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: null, // single image
  });
  const [loading, setLoading] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("sku", formData.sku);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await axios.post(
        "http://localhost/Ecommerce-Project/backend/products/create-product.php",
        data,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);
      setFormData({
        name: "",
        sku: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create product.");
    }

    setLoading(false);
  };

  return (
    <div className="py-10 flex flex-col justify-center bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg mx-auto">
        {/* Product Image */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <label htmlFor="image">
            <input
              accept="image/*"
              type="file"
              id="image"
              hidden
              onChange={handleFileChange}
            />
            <img
              className="max-w-24 cursor-pointer mt-2"
              src={formData.image ? URL.createObjectURL(formData.image) : "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"}
              alt="uploadArea"
              width={100}
              height={100}
            />
          </label>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">SKU</label>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {["Electronics", "Clothing", "Accessories"].map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Price</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Stock</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
