// src/components/Home/OffersSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const offers = [
  {
    id: 1,
    title: "Up to 50% Off Electronics",
    subtitle: "Grab the latest gadgets at amazing prices",
    image: "https://plus.unsplash.com/premium_photo-1661484666381-6eae9e502bb9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    link: "/products?category=Electronics",
  },
  {
    id: 2,
    title: "Fashion Sale",
    subtitle: "Trendy clothing at unbeatable prices",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464",
    link: "/products?category=Clothing",
  },
  {
    id: 3,
    title: "Home & Kitchen Deals",
    subtitle: "Upgrade your home with great offers",
    image: "https://images.unsplash.com/photo-1556909211-36987daf7b4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    link: "/products?category=Home & Kitchen",
  },
];

const OffersSection = () => {
  return (
    <section className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Hot Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            to={offer.link}
            className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-white font-bold text-xl mb-2">{offer.title}</h3>
              <p className="text-white">{offer.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OffersSection;
