import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
// import Footer from "../components/Footer";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReview,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
  removeSuccess,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ReviewsList({ onViewProductReviews }) {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin
  );
  const navigate = useNavigate();
  // const [selectedProduct, setSelectedProduct] = useState(null);

  // state for delete confirmation popup
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  
  const handleViewReviews = (productId) => {
    if (onViewProductReviews) {
      onViewProductReviews(productId); 
    }
  };



  const handleDeleteClick = (productId, review) => {
    setReviewToDelete({ productId, ...review });
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      dispatch(
        deleteReview({
          productId: reviewToDelete.productId,
          reviewId: reviewToDelete._id,
        })
      );
      setReviewToDelete(null);
    }
  };

  const cancelDelete = () => {
    setReviewToDelete(null);
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      navigate("/admin/products");
    }
  }, [dispatch, error, success, message]);

  // prevent background scroll when popup is open
  useEffect(() => {
    if (reviewToDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [reviewToDelete]);

  if (!products || products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-20 p-6 bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] rounded-xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-4">
            Admin Reviews
          </h1>
          <p className="text-center text-gray-600">No Product Found</p>
        </div>
      </>

    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Reviews" />
          <div className="max-w-6xl mx-auto my-10 mt-6 p-6 bg-white rounded-xl ">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
              All Products
            </h1>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
                <thead className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left">Sl No</th>
                    <th className="px-4 py-3 text-left">Product Name</th>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Reviews</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product, index) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{product.numOfReviews}</td>
                      <td className="px-4 py-3">
                        {product.numOfReviews > 0 && (
                          <button

                            onClick={() => handleViewReviews(product._id)}
                            className="px-4 py-2 bg-[#bef264] text-gray-900 rounded text-md hover:text-white font-semibold hover:bg-[#a5d64c] transition"
                          >
                            View Reviews
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {reviewToDelete && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Are you sure you want to delete this review?
                  </h3>
                  <p className="text-gray-600 mb-6 italic">
                    "{reviewToDelete.comment}"
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
                    >
                      No
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 rounded bg-[#bef264] hover:bg-[#a5d64c] text-white font-medium"
                    >
                      Yes,I want to Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* <Footer /> */}
        </>
      )}
    </>
  );
}

export default ReviewsList;
