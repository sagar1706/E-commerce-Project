import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/list-products.php"); 
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading products...</div>;

  // Featured products: top 4 for hero section
  const featured = products.slice(0, 4);

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-indigo-600 text-white h-64 flex items-center justify-center rounded-b-3xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome to GoCart</h1>
          <p className="text-lg mb-4">Shop the best products at unbeatable prices</p>
          <Link
            to="/products"
            className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-2xl p-4 shadow-lg hover:shadow-xl transition duration-300"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-2">${product.price}</p>
              <Link
                to={`/product/${product.id}`}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
