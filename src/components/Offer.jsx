import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import offer1 from "../assets/offer1.jpg";
import offer2 from "../assets/offer2.jpg";
import offer3 from "../assets/offer3.jpg";
import offer4 from "../assets/offer4.jpg";
import offer5 from "../assets/offer5.jpg";
import offer6 from "../assets/offer6.jpg";
import offer7 from "../assets/offer7.jpg";
import offer8 from "../assets/offer8.png";
import { FaArrowRight } from "react-icons/fa";

const categories = [
    { title: "Activewear", discount: "30-70% OFF", img: offer3, href: "/products?category=shoes" },
    { title: "Loungewear", discount: "30-60% OFF", img: offer4, href: "/products?category=shoes" },
    { title: "Watches", discount: "UP TO 80% OFF", img: offer7, href: "/products?category=shoes" },
    { title: "Innerwear", discount: "UP TO 70% OFF", img: offer5, href: "/products?category=tshirt" },
    { title: "Lingerie", discount: "UP TO 70% OFF", img: offer6, href: "/products?category=tshirt" },
    { title: "Ethnic Wear", discount: "50-80% OFF", img: offer1, href: "/products?category=watch" },
    { title: "WFH Casual Wear", discount: "40-80% OFF", img: offer2, href: "/products?category=watch" },
    { title: "Lingerie", discount: "UP TO 70% OFF", img: offer8, href: "/products?category=lower" },
];

export default function Offer() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        });
        AOS.refresh();
    }, []);

    return (
        <div className="max-w-7xl mx-auto lg:px-10 md:px-8 px-6 py-10">
            <div className="text-center mb-10">
                <h2
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                    data-aos="fade-up"
                >
                    Biggest Offers on Top Categories
                </h2>
                <p
                    className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl mx-auto"
                    data-aos="zoom-in"
                >
                    Shop from our exclusive selection of clothing, accessories, and more.
                    Don’t miss out on these limited-time discounts!
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden shadow-md"
                        data-aos="zoom-in"
                    >
                        <Link to={cat.href}>
                            <img
                                src={cat.img}
                                alt={cat.title}
                                className="w-full h-[200px] sm:h-[280px] md:h-[320px] object-cover"
                            />
                        </Link>

                        <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-center py-2 sm:py-4">
                            <h3 className="text-gray-900 text-xs sm:text-sm font-medium">
                                {cat.title}
                            </h3>
                            <p className="text-red-600 text-lg sm:text-2xl font-bold leading-tight">
                                {cat.discount}
                            </p>
                            <div className="flex justify-center">
                                <Link
                                    to={cat.href}
                                    className="mt-1 text-gray-900 text-sm sm:text-base font-medium hover:underline flex items-center gap-2 group"
                                >
                                    <span>Shop Now</span>
                                    <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
