import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-8 tracking-wide mt-16">
      <div className="relative max-w-screen-xl mx-auto">
        <div className="bg-[#bef264] gap-3 rounded-3xl flex flex-wrap items-center justify-between sm:px-8 max-sm:px-6 py-2 min-h-[90px] absolute top-[-60px] w-full">
          <h6 className="text-white lg:text-xl text-lg font-medium">
            Kickstart And Shopping Today
          </h6>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium rounded-full text-white gap-2 bg-gray-800 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-20">
          <div className="lg:col-span-2 max-w-sm">
            <h4 className="text-lg font-bold mb-6 text-slate-100">
              About Us
            </h4>
            <p className="text-slate-400 text-base leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              gravida, mi eu pulvinar cursus, sem elit interdum mauris.
            </p>
            <img
              src="https://triphal.com/cdn/shop/files/Untitled-5.png?v=1681644060&width=740"
              alt="About us illustration"
              className="rounded-lg shadow-md"
            />
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  Privacy & Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  Shipping Policy
                </a>
              </li>
            
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-200 text-base">
                  Return & Refund
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="text-slate-400 text-base">123 Main Street</li>
              <li className="text-slate-400 text-base">City, State, Country</li>
              <li className="text-slate-400 text-base">contact@example.com</li>
              <li className="text-slate-400 text-base">+1 234 567 890</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">
              Follow Us
            </h4>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="fill-blue-600 w-8 h-8" viewBox="0 0 49.652 49.652">
                    <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 112.196 112.196">
                    <circle cx="56.098" cy="56.097" r="56.098" fill="#007ab9" />
                    <path fill="#fff" d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c-.027.045-.065.089-.089.132h.089v-.132c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zm-54.96-36.642c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zm-6.791 59.77H41.27v-40.33H27.865v40.33z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 152 152">
                    <defs>
                      <linearGradient id="a" x1="22.26" x2="129.74" y1="22.26" y2="129.74" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#fae100" />
                        <stop offset=".15" stopColor="#fcb720" />
                        <stop offset=".3" stopColor="#ff7950" />
                        <stop offset=".5" stopColor="#ff1c74" />
                        <stop offset="1" stopColor="#6c1cd1" />
                      </linearGradient>
                    </defs>
                    <rect width="152" height="152" fill="url(#a)" rx="76" />
                    <path fill="#fff" d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z" />
                    <circle cx="76" cy="76" r="13.56" fill="#fff" />
                  </svg>
                </a>
              </li>
              
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-4 px-4 -mx-8 text-center mt-10">
        <p className="text-slate-400 text-sm">
          © SahilGlint-UI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
