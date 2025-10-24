import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Jane D",
    role: "CEO",
    avatar: "https://pagedone.io/asset/uploads/1696229969.png",
    review:
      "The user interface of this pagedone is so intuitive, I was able to start using it without any guidance.",
  },
  {
    name: "Harsh P.",
    role: "Product Designer",
    avatar: "https://pagedone.io/asset/uploads/1696229994.png",
    review:
      "I used to dread doing my taxes every year, but pagedone has made the process so much simpler and stress-free.",
  },
  {
    name: "John S",
    role: "CTO",
    avatar: "https://pagedone.io/asset/uploads/1696229969.png",
    review:
      "Pagedone’s features helped us scale quickly with ease. Absolutely love it!",
  },
];

export default function Testireview() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
          AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
          });
          AOS.refresh();
        }, []);

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-8">
          <div className="w-full lg:w-2/5">
            <h1 className="text-3xl text-gray-500 font-medium mb-4 block"
            data-aos="fade-up"
            >
                Reviews
            </h1>
            <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-6"
            data-aos="zoom-in"
            >
              23k+ Customers gave their{" "}
              <span className=" text-transparent bg-clip-text bg-[#bef264]">
                Feedback
              </span>
            </h2>

            <div className="flex gap-4 mt-4"
            data-aos="zoom-in"
            >
              <button
                ref={prevRef}
                className="group flex justify-center items-center border cursor-pointer border-[#bef264] w-12 h-12 rounded-lg hover:bg-[#bef264] transition"
              >
                <svg
                  className="h-6 w-6 text-[#bef264] group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                ref={nextRef}
                className="group flex justify-center cursor-pointer items-center border border-[#bef264] w-12 h-12 rounded-lg hover:bg-[#bef264] transition"
              >
                <svg
                  className="h-6 w-6 text-[#bef264] group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5"
          data-aos="zoom-in"
          >
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {testimonials.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className="group bg-white border border-gray-300 rounded-2xl p-6 transition hover:border-[#bef264]"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-gray-900 font-medium">
                        {item.name}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {item.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-gray-800 min-h-24">
                    {item.review}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
