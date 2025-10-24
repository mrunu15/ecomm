import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteOrder,
  fetchAllOrders,
  removeErrors,
  removeSuccess,
} from "../feature/admin/adminSlice";
import { motion, AnimatePresence } from "framer-motion";
import NoOrders from "./NoOrders";

// Custom Toast Component
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
      ${type === "success"
          ? "bg-[#bef264] hover:bg-[#a5d64c]"
          : "bg-red-400 hover:bg-red-500"
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

function OrdersList() {
  const { orders, loading, error, success, message } = useSelector(
    (state) => state.admin
  );

  const dispatch = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleDelete = (order) => {
    setSelectedOrder(order); // open modal
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      dispatch(deleteOrder(selectedOrder._id));
      setSelectedOrder(null); // close modal
    }
  };

  const cancelDelete = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
    if (success) {
      setToast({ message: message || "Action successful", type: "success" });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, error, success, message]);

  // Filter out orders that have no items
  const filteredOrders = orders?.filter(
    (order) => order.orderItems && order.orderItems.length > 0
  );

  // if (!filteredOrders || filteredOrders.length === 0) {
  //   return (
  //     <>
  //     <Navbar />
  //      <div className="flex items-center justify-center h-64">
  //       <p className="text-gray-600 text-lg font-medium">No Orders Found</p>

  //       {/* Toast */}
  //       {toast && (
  //         <Toast
  //           message={toast.message}
  //           type={toast.type}
  //           onClose={() => setToast(null)}
  //         />
  //       )}
  //     </div>
  //     </>

  //   );
  // }

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <>
        <NoOrders />
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
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
          <PageTitle title="All Orders" />
          <div className="p-6 min-h-[70vh] mt-28">
            <h1 className="text-2xl md:text-3xl text-center font-semibold text-gray-800 mb-6">
              All Orders
            </h1>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm md:text-base">
                <thead className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-gray-900 text-left">
                  <tr>
                    <th className="px-4 py-3">Sl No</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-700">
                        {order._id}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-4 py-2 rounded-xl font-medium
                            ${order.orderStatus.toLowerCase() === "processing"
                              ? "text-red-600 bg-red-50"
                              : "text-green-600 bg-green-100"
                            }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{order.orderItems.length}</td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Edit fontSize="small" />
                        </Link>
                        <button
                          className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                          onClick={() => handleDelete(order)}
                        >
                          <Delete fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Delete Order?
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Kya aap sure hain delete karna chahte ho?
                    <br />
                    <span className="font-mono text-sm text-gray-700">
                      Order ID: {selectedOrder._id}
                    </span>
                    <br />
                    <span className="font-semibold text-gray-800">
                      Price: ₹{selectedOrder.totalPrice.toFixed(2)}
                    </span>
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Footer />
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default OrdersList;
