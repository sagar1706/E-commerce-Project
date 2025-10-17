import React from "react";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ products = [], title = "Products", limit }) => {
  // Apply limit if provided
  const displayedProducts = limit ? products.slice(0, limit) : products;

  // Helper function for image URL
  const getImageUrl = (imageName) =>
    imageName
      ? `http://localhost/Ecommerce-Project/backend/uploads/${imageName}`
      : "/placeholder.png";

  if (!products.length)
    return (
      <section className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
        <p className="text-center text-gray-500">No products available.</p>
      </section>
    );

  return (
    <section className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-2xl p-4 shadow-lg hover:shadow-xl transition duration-300"
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-green-700 mb-2">${product.price}</p>
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
  );
};

export default FeaturedProducts;
