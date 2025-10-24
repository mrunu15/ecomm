import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import "swiper/css";
import "swiper/css/navigation";

import adidas from "../assets/image/adidas.png";
import puma from "../assets/image/puma.avif";
import watch1 from "../assets/image/watch1.jpg";
import casio from "../assets/image/casio.png";

const brands = [
  {
    img: "https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg",
    logo: adidas,
    logoClass: "w-28",
    href: "/products?category=shoes"
  },
  {
    img: puma,
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    logoClass: "w-20",
    href: "/products?category=tshirt"
  },
  {
    img: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    logoClass: "w-20",
    href: "/products?category=shoes"
  },
  {
    img: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSO4701-02_1_8168c0db-2c01-4ff5-8f1b-4657e2bce616.jpg",
    text: "CARGO",
    href: "/products?category=lower"
  },
  {
    img: watch1,
    logo: casio,
    logoClass: "w-28",
    href: "/products?category=watch"
  },
  {
    img: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MST2770-01_1_d63f9836-dff6-470e-ad77-efe427ca23f3.jpg",
    text: "PUMA",
    href: "/products?category=tshirt"
  }
];

export default function BrandSlider() {
  return (
    <div className="relative max-w-6xl mx-auto px-4 py-10">
      {/* Prev Button */}
      <div className="swiper-button-prev absolute top-1/2 -translate-y-1/2 left-2 sm:!left-[-40px] z-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow cursor-pointer w-8 h-8" />
      {/* Next Button */}
      <div className="swiper-button-next absolute top-1/2 -translate-y-1/2 right-2 sm:!right-[-40px] z-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow cursor-pointer w-8 h-8" />

      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }}
        modules={[Navigation]}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
        className="relative"
      >
        {brands.map((brand, index) => (
          <SwiperSlide key={index}>
            <Link to={brand.href}> {/* ✅ Make image clickable */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className="relative group overflow-hidden rounded-md"
              >
                <img
                  src={brand.img}
                  alt={brand.text || "Brand"}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt="logo"
                      className={`${brand.logoClass} object-contain`}
                    />
                  ) : (
                    <span className="text-black text-2xl font-extrabold tracking-wide">
                      {brand.text}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px !important;
          color: white !important;
          font-weight: bold !important;
        }
      `}</style>
    </div>
  );
}
