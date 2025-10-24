import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../feature/products/productSlice";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";
import { FiFilter } from "react-icons/fi";

// ✅ Custom Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed right-4 top-20 z-[10000] rounded-md px-4 py-2 text-gray-900 transition transform shadow-lg
      ${type === "success" ? "bg-[#bef264] hover:bg-[#a5d64c]" : "bg-red-500 hover:bg-red-600"}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">
          <i className={`bx ${type === "success" ? "bx-check" : "bx-x"}`} />
        </span>
        <p className="font-bold">{message}</p>
      </div>
    </div>
  );
};

function Products() {
  const { loading, error, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const categories = ["shoes", "tshirt", "watch", "lower"];

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (error) {
      setToast({ message: error.message || error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete("page");
      } else {
        newSearchParams.set("page", page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("category", cat);
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
    setFilterOpen(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="All Products" />
          <Navbar />

          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden flex justify-end mb-4">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                <FiFilter className="w-5 h-5" />
                {filterOpen ? "Close Filters" : "Show Filters"}
              </button>
            </div>

            <div
              className={`lg:block w-full lg:w-64 bg-white rounded-2xl shadow-md p-6 h-fit transform transition-all duration-300 ${
                filterOpen ? "block mb-6" : "hidden"
              } lg:block`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition ${
                      cat === category
                        ? "bg-[#bef264] text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProducts keyword={keyword} />
              )}

              <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
          </div>

          <Footer />

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </>
      )}
    </>
  );
}

export default Products;
