import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Rating from "./Rating";

function Product({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!product.images || product.images.length === 0) return;
    if (!isHovered) return; // ✅ only run when hovered

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < product.images.length ? prevIndex + 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [product.images, isHovered]);

  return (
    <div className="transition-shadow duration-300 overflow-hidden flex flex-col">
      <div
        className="relative overflow-hidden flex justify-center items-center p-4 group"
        onMouseEnter={() => setIsHovered(true)} // ✅ start slider
        onMouseLeave={() => {
          setIsHovered(false); // ✅ stop slider
          setCurrentIndex(0); // reset to first image
        }}
      >
        <span className="absolute top-3 left-3 z-10 bg-[#FFA500] text-white text-[10px] font-semibold px-1 lg:px-2 lg:py-1 rounded-tr-md rounded-bl-md shadow">
          NEW
        </span>
        <Link to={`/product/${product._id}`} className="mt-auto">
          {product.images?.length > 0 && (
            <div className="w-full h-[150px] sm:w-[280px] sm:h-[350px] flex items-center justify-center overflow-hidden">
              <img
                src={product.images[currentIndex]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
          )}
        </Link>
      </div>

      <div className="p-4 flex flex-col flex-grow mt-[-18px]">
        <div className="flex flex-col items-start space-y-1">
          <h3 className="text-[14px] sm:text-base font-semibold text-gray-800 break-words sm:line-clamp-2">
            {product.name}
          </h3>
          <Rating value={product.ratings} disabled={true} />
        </div>

        <div className="flex items-center justify-between text-sm mb-2">
          <div>
            {product.discountPrice ? (
              <>
                <span className="lg:text-lg md:text-md text-sm font-bold text-red-600 mr-2">
                  ₹{product.discountPrice}
                </span>
                <span className="lg:text-lg md:text-md text-sm font-semibold text-gray-500 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="lg:text-lg md:text-md text-sm font-bold text-gray-900">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        <Link to={`/product/${product._id}`} className="mt-auto">
          <button className="w-full text-[10px] sm:text-base flex items-center justify-center gap-2 py-1 sm:py-1 px-2 rounded-md font-semibold text-gray-900 bg-[#bef264] hover:bg-[#a5d64c] transition-all duration-300 shadow hover:shadow-md hover:scale-[1.03] active:scale-95">
            <FaShoppingCart className="text-base" />
            VIEW DETAILS
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Product;
