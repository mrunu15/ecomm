import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBack, Delete } from "@mui/icons-material";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProductReviews,
  deleteReview,
  removeErrors,
  removeSuccess,
  clearMessage,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";

function ProductReviews({ productId, onBack }) {
  const dispatch = useDispatch();

  const { reviews, loading, error, success, message } = useSelector(
    (state) => state.admin
  );

  const [reviewToDelete, setReviewToDelete] = React.useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReviews(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(clearMessage());
    }
  }, [error, success, message, dispatch]);

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      dispatch(deleteReview({ productId, reviewId: reviewToDelete._id }));
      setReviewToDelete(null);
    }
  };

  const cancelDelete = () => {
    setReviewToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto my-10 mt-6 p-6 bg-white rounded-xl relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black transition"
      >
        <ArrowBack />
      </button>

      {loading ? (
        <Loader />
      ) : reviews && reviews.length > 0 ? (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
            Reviews for Product
          </h2>
          <div className="overflow-x-auto mt-10">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left">Sl No</th>
                  <th className="px-4 py-3 text-left">Reviewer Name</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Comment</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reviews.map((review, index) => (
                  <tr
                    key={review._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{review.name}</td>
                    <td className="px-4 py-3 text-yellow-600 font-semibold">
                      ⭐ {review.rating}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{review.comment}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteClick(review)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No reviews available for this product.
          </p>
        )
      }

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
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductReviews;