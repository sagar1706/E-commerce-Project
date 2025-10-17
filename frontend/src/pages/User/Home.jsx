import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import HeroCarousel from "../../components/home/HeroCarousel";
import CategorySlider from "../../components/home/CategorySlider";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import OffersSection from "../../components/home/OffersSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import TopBrandsSection from "../../components/home/TopBrandsSection";
import CategoriesSection from "../../components/home/CategoriesSection";

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

  // Helper function to get full image URL
  const getImageUrl = (imageName) => {
    return imageName
      ? `http://localhost/Ecommerce-Project/backend/uploads/${imageName}`
      : "/placeholder.png";
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <HeroCarousel/>
     
      <OffersSection/>

      <CategoriesSection/>

      <TopBrandsSection/>

      {/* Featured Products */}
<FeaturedProducts products={products} title="Featured Products" limit={4} />

{/* All Products */}
<FeaturedProducts products={products} title="All Products" />

<TestimonialsSection/>
    </div>
  );
};

export default Home;
