import React, {useEffect} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import nike from "../assets/image/nike.jpeg";
import nikesho from "../assets/image/nikesho.avif";
import nikesho1 from "../assets/image/nikesho1.avif";
import nikeshirt from "../assets/image/nikeshirt.avif";
import nikeshirt1 from "../assets/image/nikeshirt1.avif"
import { Link } from "react-router-dom";
const CategoryGrid = () => {

   useEffect(() => {
          AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
          });
          AOS.refresh();
        }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="grid grid-cols-2 grid-rows-2 border border-gray-200">
        <div className="border border-gray-200 flex items-center justify-center"
        data-aos="zoom-in"
        >
          <img
            src={nikeshirt1}
            alt="Nike T-shirt"
            className="w-full object-cover"
          />
        </div>

        <div className="border border-gray-200 flex items-center justify-center"
        data-aos="zoom-in"
        >
          <img
            src={nikesho}
            alt="Nike T-shirt"
            className="w-full object-cover"
          />
        </div>

        <div className="border border-gray-200 flex items-center justify-center"
        data-aos="zoom-in"
        >
          <img
            src={nikesho1}
            alt="Nike T-shirt"
            className="w-full object-cover"
          />
        </div>

        <div className="border border-gray-200 flex items-center justify-center"
        data-aos="zoom-in"
        >
          <img
            src={nikeshirt}
            alt="Slides"
            className="w-full object-cover"
          />
        </div>
      </div>

      <div className="relative group overflow-hidden"
      data-aos="zoom-in"
      >
        <img
          src={nike} 
          alt="Monsoon Edit"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6">
          <div></div>
          
          <div className="flex justify-end">
            <Link to="/products?category=shoes">
             <button className="text-white hover:text-[#bef264] text-lg font-extrabold flex items-center gap-1">
              EXPLORE →
            </button>
            </Link>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
