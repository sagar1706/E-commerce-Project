import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Ecommerce-Project/backend/categories/list-categories.php"
        );
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center py-10">Loading categories...</p>;

  return (
    <section className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Shop by Category</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <Link
            to={`/products?category=${cat.slug}`}
            key={cat.slug}
            className="flex-shrink-0 w-32 md:w-40 bg-white rounded-xl shadow-lg hover:shadow-xl transition p-3 flex flex-col items-center"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full mb-2"
            />
            <span className="text-center font-medium text-gray-700">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySlider;
