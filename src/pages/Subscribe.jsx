import React, {useEffect} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRight } from "react-icons/fa";
const Subscribe = () => {

    useEffect(() => {
              AOS.init({
                duration: 1000,
                once: false,
                mirror: true,
              });
              AOS.refresh();
            }, []);
    return (
        <section className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-center py-16 px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
            >
                Subscribe to our emails
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8"
            data-aos="zoom-in"
            >
                <strong>
                    Be the first to know about new collections and exclusive offers.
                </strong>
            </p>

            <form className="flex flex-col sm:flex-row items-center justify-center max-w-lg mx-auto bg-white rounded-lg sm:rounded-full shadow-md overflow-hidden border border-gray-200"
            data-aos="fade-up"
            >
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#bef264] border-b sm:border-b-0 sm:border-r border-gray-200 sm:rounded-l-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-[#bef264] text-white px-6 py-3 text-lg font-medium hover:bg-[#a5d64c] transition-all duration-300 w-full sm:w-auto sm:rounded-r-full flex items-center justify-center gap-2 group"
                >
                    <span>Subscribe</span>
                    <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-2" />
                </button>
            </form>

            <p className="text-sm text-gray-500 mt-4"
            data-aos="zoom-in"
            >
                We respect your privacy. Unsubscribe at any time.
            </p>
        </section>
    );
};

export default Subscribe;
