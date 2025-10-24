import React, { useState, useEffect } from "react";

const images = [
  "https://neemans.com/cdn/shop/files/Desktop_Banner_1920X800_21050fcd-8ae6-44fe-a0cb-8ba23c1bdbd0.jpg",
  "https://veirdo.in/cdn/shop/files/Artboard_1_57.jpg?v=1752841979",
  "https://neemans.com/cdn/shop/files/1920X800_-_Website_banner.jpg?v=1752941237&width=1500",
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative mt-16 h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-10 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 hover:bg-white/70">
          <svg
            className="w-4 h-4 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 6 10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 1 1 5l4 4" />
          </svg>
        </span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-10 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/40 hover:bg-white/70">
          <svg
            className="w-4 h-4 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 6 10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m1 9 4-4-4-4" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ImageSlider;
