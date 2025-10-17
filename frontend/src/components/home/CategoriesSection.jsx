// src/components/Home/CategoriesSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const categoriesData = [
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400",
    link: "/products?category=electronics"
  },
  {
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?q=80&w=400",
    link: "/products?category=clothing"
  },
  {
    name: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
    link: "/products?category=books"
  },
  {
    name: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1582719478172-1c8a1988e982?q=80&w=400",
    link: "/products?category=home-kitchen"
  },
];

const CategoryCard = ({ category }) => (
  <Link to={category.link} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
    <img
      src={category.image}
      alt={category.name}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
      <h3 className="text-white text-xl font-bold">{category.name}</h3>
    </div>
    <div className="p-4 text-center">
      <h3 className="text-lg font-semibold">{category.name}</h3>
    </div>
  </Link>
);

const CategoriesSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categoriesData.map((category, idx) => (
          <CategoryCard key={idx} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
