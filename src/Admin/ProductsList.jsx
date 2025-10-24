import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Delete, Edit, Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchAdminProducts,
  removeErrors,
  removeSuccess,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import NoProducts from "./NoProducts";


function ProductsList() {
  const { products, loading, error, deleting } = useSelector(
    (state) => state.admin
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [parsedProducts, setParsedProducts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const productsWithParsedDetails = products.map(product => ({
        ...product,
        details: typeof product.details === 'string' ? JSON.parse(product.details) : product.details
      }));
      setParsedProducts(productsWithParsedDetails);
    }
  }, [products]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id)).then((action) => {
        if (action.type === "admin/deleteProduct/fulfilled") {
          toast.success("Product Deleted Successfully", {
            position: "top-center",
            autoClose: 3000,
          });
          dispatch(removeSuccess());
          closeDeleteModal();
        }
      });
    }
  };

  // if (!parsedProducts || parsedProducts.length === 0) {
  //   return (
  //     <>
  //     <Navbar />
  //     <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 p-6 rounded-xl shadow-md mt-16">
  //       <h1 className="text-2xl font-semibold text-gray-800 mb-4">
  //         Admin Products
  //       </h1>
  //       <p className="text-gray-600 text-lg">No Products Found</p>
  //     </div>
  //     </>

  //   );
  // }

  if (!parsedProducts || parsedProducts.length === 0) {
    return (
      <>
        <Navbar />
        <NoProducts />
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
          <PageTitle title="All Products" />
          {/* <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-md min-h-screen mt-24"> */}
          <div className="p-2 sm:p-4 md:p-6 bg-gray-50 rounded-2xl shadow-none min-h-[75vh] mt-4 w-full no-scrollbar overflow-y-auto">

            <h1 className="text-2xl text-lg sm:text-2xl md:text-2xl text-center font-semibold text-gray-800 mb-4">
              All Products
            </h1>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base">
                <thead className="bg-[#bef264] text-gray-900">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Image</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    {/* <th className="px-3 py-2 text-left">Description</th> */}
                    <th className="px-3 py-2 text-left">Price</th>
                    <th className="px-3 py-2 text-left">Discount</th>
                    <th className="px-3 py-2 text-left">Ratings</th>
                    <th className="px-3 py-2 text-left">Reviews</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Details</th>
                    <th className="px-3 py-2 text-left">Stock</th>
                    <th className="px-3 py-2 text-left">Created At</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">
                        <img
                          src={
                            product.images?.[0]?.url || "/fallback-image.png"
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-700">
                        {product.name}
                      </td>
                      {/* <td className="px-3 py-2">{product.description}</td> */}
                      <td className="px-3 py-2 font-semibold text-gray-800">
                        ₹{product.price}
                      </td>
                      <td className="px-3 py-2 font-semibold text-gray-800">
                        ₹{product.discountPrice}
                      </td>
                      <td className="px-3 py-2 text-yellow-600 font-medium">
                        ⭐ {product.ratings}
                      </td>
                      <td className="px-3 py-2">{product.numOfReviews}</td>
                      <td className="px-3 py-2">{product.category}</td>
                      <td className="px-3 py-2 flex flex-wrap gap-1">
                        {product.details?.shoes?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Shoes: {size}
                          </span>
                        ))}
                        {product.details?.tshirt?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Tshirt: {size}
                          </span>
                        ))}
                        {product.details?.lower?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Lower: {size}
                          </span>
                        ))}
                        {product.details?.watch?.brand && (
                          <span className="px-2 py-1 bg-[#bef264] text-gray-900 rounded-full text-xs">
                            Brand: {product.details.watch.brand}
                          </span>
                        )}
                        {product.details?.watch && "waterResistant" in product.details.watch && (
                          <span className="px-2 py-1 bg-[#bef264] text-gray-900 rounded-full text-xs">
                            Water Resistant:{" "}
                            {product.details.watch.waterResistant ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-3 py-2 font-medium ${product.stock > 5
                            ? "text-green-600"
                            : product.stock > 0
                              ? "text-orange-500"
                              : "text-red-600"
                          }`}
                      >
                        {product.stock}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-sm">
                        {new Date(product.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 flex items-center gap-2">
                        <Link
                          to={`/admin/product/${product._id}`}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Edit fontSize="small" />
                        </Link>
                        <button
                          className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deleting?.[product._id]}
                          onClick={() => openDeleteModal(product)}
                        >
                          {deleting?.[product._id] ? <Loader /> : <Delete fontSize="small" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="block md:hidden">

              {parsedProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-white p-3 rounded-xl shadow-md border border-gray-200 w-full max-w-[340px] mx-auto flex flex-col mb-4"
                >
                  <div className="w-full mb-3">
                    <img
                      src={product.images?.[0]?.url || "/fallback-image.png"}
                      alt={product.name}
                      className="h-20 w-20 object-cover rounded-lg border" 
                    />

                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-800 text-sm sm:text-base truncate text-lg mt-2">
                        {index + 1}. {product.name}
                      </h2>
                      {/* <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p> */}
                      <p className="text-gray-800 font-medium mt-1 text-sm">
                        ₹{product.price}{" "}
                        <span className="line-through text-gray-500 text-xs text-sm">
                          ₹{product.discountPrice}
                        </span>
                      </p>
                      <p className="text-yellow-600 text-xs mt-1">
                        ⭐ {product.ratings} ({product.numOfReviews} reviews)
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: {product.category}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.details?.shoes?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Shoes: {size}
                          </span>
                        ))}
                        {product.details?.tshirt?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Tshirt: {size}
                          </span>
                        ))}
                        {product.details?.lower?.size?.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 bg-[#bef264] text-gray-900 rounded-full text-xs"
                          >
                            Lower: {size}
                          </span>
                        ))}
                        {product.details?.watch?.brand && (
                          <span className="px-2 py-0.5 bg-[#bef264] text-gray-900 rounded-full text-xs">
                            Brand: {product.details.watch.brand}
                          </span>
                        )}
                        {product.details?.watch && "waterResistant" in product.details.watch && (
                          <span className="px-2 py-0.5 bg-[#bef264] text-gray-900 rounded-full text-xs">
                            Water Resistant:{" "}
                            {product.details.watch.waterResistant ? "Yes" : "No"}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs text-sm font-medium mt-2 mt-1 ${product.stock > 5
                            ? "text-green-600"
                            : product.stock > 0
                              ? "text-orange-500"
                              : "text-red-600"
                          }`}
                      >
                        Stock: {product.stock}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Link
                      to={`/admin/product/${product._id}`}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Edit fontSize="small" />
                    </Link>
                    <button
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleting?.[product._id]}
                      onClick={() => openDeleteModal(product)}
                    >
                      {deleting?.[product._id] ? <Loader /> : <Delete fontSize="small" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <Footer /> */}

          {/* Delete Confirmation Modal */}
          {deleteModalOpen && productToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
                  <button
                    onClick={closeDeleteModal}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <Close />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-5 p-3 bg-red-50 rounded-lg">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={productToDelete.images?.[0]?.url || "/fallback-image.png"}
                      alt={productToDelete.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{productToDelete.name}</h4>
                    <p className="text-sm text-gray-600">
                      ₹{productToDelete.price} • {productToDelete.category}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(productToDelete.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-center">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting?.[productToDelete._id]}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {deleting?.[productToDelete._id] ? (
                      <>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Delete fontSize="small" />
                        Yes, I want Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ProductsList;