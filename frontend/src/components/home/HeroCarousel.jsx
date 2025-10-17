import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const slides = [
   {
    id: 1,
    title: "Mega Sale on Electronics ⚡",
    subtitle: "Up to 50% OFF on top brands!",
    image:
    "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=876",
    link: "/products?category=electronics",
  },
  {
    id: 2,
    title: "Fashion Fiesta 👗",
    subtitle: "Trendy styles at unbeatable prices.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80",
    link: "/products?category=fashion",
  },
  {
    id: 3,
    title: "Home & Kitchen Essentials 🍳",
    subtitle: "Upgrade your living space today!",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
    link: "/products?category=home",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);

  // Auto-slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Swipe handling
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;
    if (diff > 50) {
      // swipe left → next
      setCurrent((prev) => (prev + 1) % slides.length);
    } else if (diff < -50) {
      // swipe right → previous
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl shadow-lg"
      ref={slideRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 relative h-full"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
              <Link
                to={slide.link}
                className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i ? "bg-white w-6" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
