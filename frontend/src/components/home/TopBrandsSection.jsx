// src/components/Home/TopBrandsSection.jsx
import React from "react";

const brandsData = [
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Sony_logo.svg" },
    { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_logo.svg" },
];

const BrandCard = ({ brand }) => (
    <div className="p-4 mx-4 shrink-0 flex items-center justify-center bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 w-32 h-32">
        <img src={brand.logo} alt={brand.name} className="max-h-16 object-contain" />
    </div>
);

const TopBrandsSection = () => {
    return (
        <>
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 20s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            <section className="bg-gray-50 py-12">
                <h2 className="text-3xl font-bold text-center mb-10">Top Brands</h2>

                {/* Marquee scrolling */}
                <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative mb-6">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
                    <div className="marquee-inner flex transform-gpu min-w-[200%]">
                        {[...brandsData, ...brandsData].map((brand, idx) => (
                            <BrandCard key={idx} brand={brand} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
                </div>

                <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
                    <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%]">
                        {[...brandsData, ...brandsData].map((brand, idx) => (
                            <BrandCard key={idx} brand={brand} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
                </div>
            </section>
        </>
    );
};

export default TopBrandsSection;
