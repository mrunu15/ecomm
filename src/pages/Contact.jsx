import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import contactBg from "../assets/contactimg.jpg"

const ZoomInAnimation = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // helper to show toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000); // auto hide after 3s
  };


  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  // handle submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Message sent successfully!", "success");
        setFormValues({ name: "", email: "", phone: "", message: "" });
      } else {
        showToast(data.error || "Failed to send message", "error");
      }

    } catch (error) {
      console.error(error);
      showToast("Something went wrong. Please try again later.", "error");
    }


    setLoading(false);
  };

  return (
    <>
      <Navbar />
      {toast.show && (
        <div
          className={`fixed right-4 z-10 top-20 px-4 py-2 rounded-md shadow-lg text-white transition-all 
      ${toast.type === "success" ? "bg-[#bef264] hover:bg-[#a5d64c]" : "bg-red-500 hover:bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      <div
        className="min-h-screen py-14 sm:px-6 px-6 md:px-16 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${contactBg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="mb-10 mt-20 text-white">
            <nav className="text-sm text-gray-200">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <a href="#" className="hover:text-gray-300">
                    Home
                  </a>
                  <svg
                    className="fill-current w-3 h-3 mx-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                  </svg>
                </li>
                <li className="text-white">Contact</li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-[30%] flex flex-col gap-8">
              <ZoomInAnimation delay={0.1}>
                <div className="flex items-start gap-4 bg-white p-8 rounded-lg shadow-md">
                  <div className="bg-[#bef264] p-3 rounded-lg">
                    <Phone className="text-gray-900" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      Call To Us
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      We are available 24/7, 7 days a week.
                    </p>
                    <p className="text-gray-600 font-medium text-sm">
                      +91 6397863981
                    </p>
                  </div>
                </div>
              </ZoomInAnimation>

              <ZoomInAnimation delay={0.2}>
                <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-[#bef264] p-3 rounded-lg">
                    <Mail className="text-gray-900" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Write To Us
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      Fill out our form and we will contact you within 24 hours.
                    </p>
                    <p className="text-gray-600 text-sm font-medium">
                      customer@exclusive.com
                    </p>
                    <p className="text-gray-600 text-sm font-medium">
                      support@exclusive.com
                    </p>
                  </div>
                </div>
              </ZoomInAnimation>
            </div>

            {/* Right Column: Form */}
            <ZoomInAnimation delay={0.3}>
              <div className="w-full lg:w-[700px] bg-white p-8 rounded-lg shadow-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "name", label: "Name", type: "text" },
                      { id: "email", label: "Email", type: "email" },
                      { id: "phone", label: "Phone", type: "tel" },
                    ].map((input) => (
                      <div key={input.id} className="relative w-full">
                        <input
                          type={input.type}
                          id={input.id}
                          value={formValues[input.id]}
                          onChange={handleChange}
                          placeholder=" "
                          className="peer w-full text-gray-800 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                        />
                        <label
                          htmlFor={input.id}
                          className="absolute left-3 top-2.5 px-1 bg-white text-gray-400 text-sm transition-all
                          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#bef264]
                          peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#bef264]"
                        >
                          {input.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="relative w-full">
                    <textarea
                      id="message"
                      value={formValues.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder=" "
                      className="peer w-full text-gray-800 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                    ></textarea>
                    <label
                      htmlFor="message"
                      className="absolute left-3 top-2.5 px-1 bg-white text-gray-400 text-sm transition-all
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#bef264]
                      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#bef264]"
                    >
                      Your Message
                    </label>
                  </div>

                  <div className="flex justify-end">
                    {/* <button
                      type="submit"
                      className="px-6 py-2 bg-[#bef264] hover:bg-[#a5d64c] text-gray-900 font-medium rounded-md transition-colors"
                    >
                      Send Message
                    </button> */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${loading
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[#bef264] hover:bg-[#a5d64c] text-gray-900"
                        }`}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </ZoomInAnimation>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
