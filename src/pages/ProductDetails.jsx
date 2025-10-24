import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useParams, useNavigate } from "react-router-dom";
import {
  createReview,
  getProductDetails,
  removeErrors,
  removeSuccess,
} from "../feature/products/productSlice";
import Loader from "../components/Loader";
import { addItemsToCart, removeMessage } from "../feature/cart/cartSlice";
import { motion } from "framer-motion";

// Custom Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed right-4 top-20 z-[10000] rounded-md px-4 py-2 text-gray-900 transition transform shadow-lg
      ${type === "success"
          ? "bg-[#bef264] hover:bg-[#a5d64c]"
          : "bg-red-500 hover:bg-red-600"
        }`}
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

function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]); // multiple images
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState("");
  const [parsedProduct, setParsedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector(
    (state) => state.product
  );
  const { loading: cartLoading, error: cartError, success, message } =
    useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      const productWithParsedDetails = {
        ...product,
        details:
          typeof product.details === "string"
            ? JSON.parse(product.details)
            : product.details,
      };
      setParsedProduct(productWithParsedDetails);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      addToast(error.message, "error");
      dispatch(removeErrors());
    }
    if (cartError) {
      addToast(cartError, "error");
    }
  }, [dispatch, error, cartError]);

  useEffect(() => {
    if (success) {
      addToast(message, "success");
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      addToast("Quantity cannot be less than 1", "error");
      return;
    }
    setQuantity((qty) => qty - 1);
  };

  const increaseQuantity = () => {
    if (parsedProduct?.stock <= quantity) {
      addToast("Cannot exceed available Stock!", "error");
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const addToCart = () => {
    if (hasSizes() && !selectedSize) {
      addToast("Please select a size", "error");
      return;
    }

    dispatch(
      addItemsToCart({
        id,
        quantity,
        size: selectedSize,
      })
    );
  };

  const buyNowHandler = () => {
    if (hasSizes() && !selectedSize) {
      addToast("Please select a size", "error");
      return;
    }

    dispatch(
      addItemsToCart({
        id,
        quantity,
        size: selectedSize,
      })
    );

    if (user) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  const handleReviewSubmit = (e) => {
  e.preventDefault();
  if (!userRating) {
    addToast("Please Select a rating", "error");
    return;
  }

  dispatch(
    createReview({
      rating: userRating,
      comment,
      images: reviewImages,
      productId: id,
    })
  );
};
  useEffect(() => {
    if (reviewSuccess) {
      addToast("Review Submitted Successfully", "success");
      setUserRating(0);
      setComment("");
      setReviewImages([]);
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [reviewSuccess, id, dispatch]);

  useEffect(() => {
    if (parsedProduct && parsedProduct.images && parsedProduct.images.length > 0) {
      setSelectedImage(parsedProduct.images[0].url);
    }
  }, [parsedProduct]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setReviewImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const hasSizes = () => {
    return (
      parsedProduct?.details &&
      parsedProduct.details[parsedProduct.category] &&
      parsedProduct.details[parsedProduct.category].size &&
      parsedProduct.details[parsedProduct.category].size.length > 0
    );
  };

  const getSizes = () => {
    if (parsedProduct?.details && parsedProduct.details[parsedProduct.category]) {
      return parsedProduct.details[parsedProduct.category].size || [];
    }
    return [];
  };

  const getAdditionalDetails = () => {
    if (!parsedProduct?.details || !parsedProduct.details[parsedProduct.category])
      return null;

    const categoryDetails = parsedProduct.details[parsedProduct.category];
    const detailsToShow = [];

    for (const [key, value] of Object.entries(categoryDetails)) {
      if (key !== "size" && value) {
        detailsToShow.push({ key, value });
      }
    }

    return detailsToShow.length > 0 ? detailsToShow : null;
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !parsedProduct) {
    return (
      <>
        <PageTitle title="Product Details" />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-lg">
            Product not found or error loading product details.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const additionalDetails = getAdditionalDetails();
  const sizes = getSizes();

  return (
    <>
      <PageTitle title={`${parsedProduct.name} - Details`} />
      <Navbar />
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-20 sm:py-20 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div className="w-full md:w-[50%] lg:w-[500px] mt-4 lg:mt-0">
            <div
              className="relative w-full 
             h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] 
             bg-white rounded-lg overflow-hidden cursor-zoom-in shadow-md"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedImage}
                alt={parsedProduct.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              {isZoomed && (
                <div className="absolute inset-0 pointer-events-none border-2 border-gray-300 rounded-lg"></div>
              )}
            </div>


            {parsedProduct.images && parsedProduct.images.length > 1 && (
              <div className="mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {parsedProduct.images.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === img.url
                      ? 'ring-2 ring-[#bef264]'
                      : 'ring-1 ring-gray-200'
                      }`}
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-[50%] lg:w-[700px]">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {parsedProduct.name}
              </h2>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Rating value={parsedProduct.ratings} disabled={true} />
                  <span className="ml-2 text-sm text-gray-600">
                    ({parsedProduct.numOfReviews}{' '}
                    {parsedProduct.numOfReviews === 1 ? 'Review' : 'Reviews'})
                  </span>
                </div>

                <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800 capitalize">
                  {parsedProduct.category}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{parsedProduct.discountPrice ?? parsedProduct.price}
                  </span>
                  {parsedProduct.discountPrice && parsedProduct.price > parsedProduct.discountPrice && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ₹{parsedProduct.price}
                      </span>
                      <span className="ml-2 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        {Math.round((1 - parsedProduct.discountPrice / parsedProduct.price) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <span
                  className={`mt-2 sm:mt-0 font-medium ${parsedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {parsedProduct.stock > 0
                    ? `In Stock (${parsedProduct.stock} available)`
                    : 'Out of Stock'}
                </span>
              </div>


              <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                {parsedProduct.description}
              </p>

              {/* Size Selection */}
              {hasSizes() && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Select Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === size
                          ? 'bg-[#bef264] border-[#bef264] text-gray-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Product Details */}
              {additionalDetails && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Product Details:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {additionalDetails.map((detail, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {detail.key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="ml-2 text-sm text-gray-800">
                          {typeof detail.value === 'boolean'
                            ? detail.value ? 'Yes' : 'No'
                            : detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedProduct.stock > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-medium text-sm sm:text-base">
                      Quantity:
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 rounded bg-gradient-to-b from-gray-50 to-gray-100 text-lg hover:bg-gray-100 transition"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </motion.button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-10 sm:w-12 h-8 sm:h-9 text-center border border-gray-300 rounded text-sm sm:text-base"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 rounded bg-gradient-to-b from-gray-50 to-gray-100 text-lg hover:bg-gray-100 transition"
                      onClick={increaseQuantity}
                      disabled={parsedProduct.stock <= quantity}
                    >
                      +
                    </motion.button>
                  </div>

                  {/* Add to Cart and Buy Now buttons in a row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 sm:py-3 bg-[#bef264] text-gray-900 font-semibold rounded-lg hover:bg-[#a5d64c] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      onClick={addToCart}
                      disabled={cartLoading || parsedProduct.stock === 0}
                    >
                      {cartLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        'Add to Cart'
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 sm:py-3 bg-[#F49210] text-white font-semibold rounded-lg hover:bg-[#DD7106] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      onClick={buyNowHandler}
                      disabled={cartLoading || parsedProduct.stock === 0}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </>
              )}
            </div>

            {/* Review Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-md"
            >
              <h3 className="font-semibold text-xl mb-4 text-gray-800">
                Write a Review
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <Rating
                    value={userRating}
                    disabled={false}
                    onRatingChange={handleRatingChange}
                  />
                </div>

                {/* Comment */}
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg resize-y min-h-[120px] text-sm sm:text-base 
              focus:ring-2 focus:ring-[#bef264] focus:border-[#bef264] outline-none transition-all duration-200"
                  />
                </motion.div>

                {/* Image Upload */}
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setReviewImages(Array.from(e.target.files))}
                  />
                </div>

                {/* Preview */}
                {reviewImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {reviewImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#bef264] text-gray-900 font-semibold px-6 py-3 rounded-lg 
            hover:bg-[#a5d64c] transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={reviewLoading}
                  type="submit"
                >
                  {reviewLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                     1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 
                     0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 
                     1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Submit Review
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-xl mb-4 text-gray-800">
            Customer Reviews
          </h3>

          {parsedProduct?.reviews && parsedProduct.reviews.length > 0 ? (
            <div className="space-y-6">
              {parsedProduct.reviews.map((review, index) => {
                const maxPreviewMobile = 2; // only show 2 images in first row on mobile
                const totalImages = review.images?.length || 0;
                const extraCount =
                  totalImages > maxPreviewMobile
                    ? totalImages - maxPreviewMobile
                    : 0;

                return (
                  <motion.div
                    key={review._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    {/* Rating + Date */}
                    <div className="flex items-center gap-2">
                      <Rating value={review.rating} disabled={true} />
                      <span className="text-sm text-gray-500">
                        {review.createdAt &&
                          new Date(review.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="mt-1 text-gray-700 text-sm sm:text-base">
                      {review.comment}
                    </p>

                    {/* Reviewer */}
                    <p className="text-sm text-gray-500 mt-1">By: {review.name}</p>

                    {/* Review Images */}
                    {totalImages > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {review.images.map((img, idx) => {
                          // hide extra images on mobile except first 2
                          if (idx >= maxPreviewMobile && window.innerWidth < 640) {
                            return null;
                          }

                          const isSecondImageWithExtra =
                            idx === 1 && extraCount > 0 && window.innerWidth < 640;

                          return (
                            <div
                              key={idx}
                              className="relative w-full aspect-square overflow-hidden rounded-md border"
                            >
                              <img
                                src={img.url || img}
                                alt={`review-${index}-${idx}`}
                                onClick={() => {
                                  setCurrentImages(review.images);
                                  setCurrentImageIndex(idx);
                                  setLightboxOpen(true);
                                }}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                              />

                              {/* Extra Count Overlay */}
                              {isSecondImageWithExtra && (
                                <div
                                  onClick={() => {
                                    setCurrentImages(review.images);
                                    setCurrentImageIndex(idx);
                                    setLightboxOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold cursor-pointer"
                                >
                                  +{extraCount}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 mb-6"
            >
              No reviews yet. Be the first to review this product!
            </motion.div>
          )}

          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <div className="relative flex items-center justify-center">
                <button
                  className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => setLightboxOpen(false)}
                >
                  ×
                </button>

                {currentImageIndex > 0 && (
                  <button
                    className="absolute left-2 text-white text-3xl px-2 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60"
                    onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                  >
                    ‹
                  </button>
                )}

                <motion.img
                  key={currentImageIndex}
                  src={
                    currentImages[currentImageIndex].url ||
                    currentImages[currentImageIndex]
                  }
                  alt="review-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg object-contain"
                />

                {currentImageIndex < currentImages.length - 1 && (
                  <button
                    className="absolute right-2 text-white text-3xl px-2 py-1 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60"
                    onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                  >
                    ›
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

      </div>
      <Footer />

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
export default ProductDetails;