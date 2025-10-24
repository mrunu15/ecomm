import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Store, DollarSign, ShoppingBag, Wallet } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
const stats = [
  {
    id: 1,
    icon: <Store className="w-10 h-10 text-black" />,
    value: "5k",
    label: "Sellers active our site",
     highlight: true,
     
  },
  {
    id: 2,
    icon: <DollarSign className="w-10 h-10 text-black" />,
    value: "400k",
    label: "Monthly Product Sale",
   
  },
  {
    id: 3,
    icon: <ShoppingBag className="w-10 h-10 text-black" />,
    value: "2.5k",
    label: "Customer active in our site",
  },
  {
    id: 4,
    icon: <Wallet className="w-10 h-10 text-black" />,
    value: "89k",
    label: "monthly gross sale in our site",
  },
];

const team = [
  {
    id: 1,
    name: "Tom Cruise",
    role: "Founder & Chairman",
    img: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg",
  },
  {
    id: 2,
    name: "Emma Watson",
    role: "Managing Director",
    img: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg",
  },
  {
    id: 3,
    name: "Will Smith",
    role: "Product Designer",
    img: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg",
  },
  {
    id: 4,
    name: "Robert Downey Jr.",
    role: "Lead Engineer",
    img: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg",
  },
  {
    id: 5,
    name: "Scarlett Johansson",
    role: "Marketing Head",
    img: "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg",
  },
];
const features = [
  {
    id: 1,
    icon: "/images/delivery.png", 
    title: "FREE AND FAST DELIVERY",
    desc: "Free delivery for all orders over ₹1999",
  },
  {
    id: 2,
    icon: "/images/service.png", 
    title: "24/7 CUSTOMER SERVICE",
    desc: "Friendly 24/7 customer support",
  },
  {
    id: 3,
    icon: "/images/gaurantee.png", 
    title: "MONEY BACK GUARANTEE",
    desc: "We return money within 30 days",
  },
];

const zoomInVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};
 function About() {
    const cardVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // delay each card
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};
  return (
    <>
    <Navbar />
       <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-20 overflow-hidden">
      
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/20"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 92%, 0 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full px-4 md:px-0">
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
    className="w-full md:w-1/2 text-left text-white drop-shadow-lg"
  >
    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
      Our Story
    </h1>
    <p className="mt-4 text-md text-gray-200">
      Founded in 2025 in the scenic state of Uttarakhand, India, Exclusive is an emerging e-commerce platform built to redefine online shopping. From its humble beginnings, Exclusive has quickly grown into a trusted marketplace that connects sellers, brands, and customers through a modern, reliable, and user-friendly experience. With a diverse catalog of products spanning daily essentials to premium lifestyle items, Exclusive is committed to delivering value, convenience, and innovation to every household across the region.
    </p>
    <a href="/products">
    <button className="mt-6 px-6 py-3 rounded-2xl text-gray-900 font-medium text-md hover:text-white bg-[#bef264] hover:bg-[#a5d64c] transition-all shadow-lg">
      Get Started
    </button>
    </a>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    viewport={{ once: true, amount: 0.3 }}
    className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-start md:justify-center"
  >
    <div className="w-full max-w-md md:max-w-lg aspect-video rounded-2xl overflow-hidden shadow-xl">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://media.istockphoto.com/id/2212840542/video/boxer-jumps-around-ring-floor-preparing-to-begin-training.mp4?s=mp4-640x640-is&k=20&c=bGvnZKAwRuYah7BvpPR5FUnVxHuGgcNCu_HXo9nPe-c=" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </motion.div>
</div>

    </section>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-6 px-6 md:px-16 py-8">
       {stats.map((item, index) => (
        <motion.div
          key={item.id}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }} 
          variants={cardVariants}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border shadow-sm transition-all duration-300 cursor-pointer ${
            item.highlight
              ? "bg-[#bef264] text-white"
              : "bg-white text-black hover:bg-[#bef264] hover:text-white"
          }`}
        >
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${
              item.highlight
                ? "border-white bg-white/20"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            {item.icon}
          </div>

          <h2 className="text-3xl font-bold mt-4">{item.value}</h2>

          <p className="text-sm mt-2 text-center font-medium">{item.label}</p>
        </motion.div>
      ))}
    </div>

      <div className="relative w-full px-4 sm:px-6 md:px-12 lg:px-16 mx-auto py-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 1 },   // mobile
          640: { slidesPerView: 2 },   // tablet
          1024: { slidesPerView: 3 },  // desktop
        }}
        className="pb-10"
      >
        {team.map((member) => (
          <SwiperSlide key={member.id}>
            <div className="flex flex-col items-center overflow-hidden text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-full max-w-[300px] h-[350px] object-cover rounded-md"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
                <div className="flex justify-center gap-4 mt-3 text-gray-600 text-lg">
                  <a href="#"><FaTwitter /></a>
                  <a href="#"><FaInstagram /></a>
                  <a href="#"><FaLinkedin /></a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Left/Right Arrows */}
        <div className="swiper-button-prev !w-10 !h-10 !bg-white hover:!bg-[#bef264] !rounded-full !shadow-md flex items-center justify-center after:!text-black after:!text-lg font-bold"></div>
        <div className="swiper-button-next !w-10 !h-10 !bg-white hover:!bg-[#bef264] !rounded-full !shadow-md flex items-center justify-center after:!text-black after:!text-lg font-bold"></div>
      </Swiper>
    </div>

    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
      {features.map((item, index) => (
        <motion.div
          key={item.id}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          variants={zoomInVariants}
          className="flex flex-col items-center"
        >
          {/* Icon wrapper */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 rounded-full scale-125 -z-10"></div>
            <img
              src={item.icon}
              alt={item.title}
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Title */}
          <h3 className="mt-4 text-sm sm:text-base md:text-lg font-bold uppercase">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{item.desc}</p>
        </motion.div>
      ))}
    </div>
    <Footer />
    </>
  );
}

export default About;
