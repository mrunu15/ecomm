import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, removeErrors } from "../feature/order/orderSlice";
import Loader from "../components/Loader";

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
      ${
        type === "success"
          ? "bg-[#bef264] hover:bg-[#a5d64c]"
          : type === "error"
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-400 hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">
          <i
            className={`bx ${
              type === "success"
                ? "bx-check"
                : type === "error"
                ? "bx-x"
                : "bx-info-circle"
            }`}
          />
        </span>
        <p className="font-bold">{message}</p>
      </div>
    </div>
  );
};

function OrderDetails() {
  const { orderId } = useParams();
  const { order, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error, orderId]);

  if (!order) return null;

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    taxPrice,
    shippingPrice,
    itemPrice,
    paidAt,
    createdAt,
    user = {},
  } = order;

  const paymentStatus =
    paymentInfo?.status?.toLowerCase() === "succeeded"
      ? "Paid"
      : paymentInfo?.status || "Not Paid";

  const finalOrderStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const orderStatusClass =
    finalOrderStatus === "Delivered"
      ? "bg-green-100 text-green-600"
      : finalOrderStatus === "Processing"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-red-100 text-red-600";

  const paymentStatusClass =
    paymentStatus === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";

  return (
    <>
      <PageTitle title={`Order #${orderId}`} />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-6xl mx-auto mt-28 p-4 md:p-6 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* User Details */}
              <div className=" bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] rounded-2xl shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-900 pb-2 ">
                  Details
                </h2>
                <p className="text-gray-800">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>

              {/* Shipping Info */}
              <div className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] rounded-2xl shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-900 pb-2">
                  Shipping Info
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Address:</span>{" "}
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.state}, {shippingInfo.country} -{" "}
                    {shippingInfo.pinCode}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Phone:</span>{" "}
                    {shippingInfo.phoneNo}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] rounded-2xl shadow-md p-4 md:p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-900 pb-2">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-4 border-b border-gray-900 pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex flex-col font-semibold items-end">
                        <p className="text-red-500 text-sm line-through">
                          ₹{Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-gray-800 font-semibold">
                          ₹{Number(itemPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] rounded-2xl shadow-md p-4 md:p-6 h-fit">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-900 pb-2">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-600">Order Status</p>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${orderStatusClass}`}
                    >
                      {finalOrderStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-600">Payment</p>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${paymentStatusClass}`}
                    >
                      {paymentStatus} ({paymentInfo.method || "N/A"})
                    </span>
                  </div>
                  {paidAt && (
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-600">Paid At</p>
                      <p className="text-gray-800">
                        {new Date(paidAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-600">Items Price</p>
                    <p className="text-gray-800">
                      ₹{Number(itemPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-600">Tax Price</p>
                    <p className="text-gray-800">
                      ₹{Number(taxPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-600">Shipping Price</p>
                    <p className="text-gray-800">
                      ₹{Number(shippingPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-900 pt-3">
                    <p>Total Price</p>
                    <p>₹{Number(totalPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-md p-4 md:p-6 bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c]">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  Order #{orderId}
                </h1>
                <p className="text-gray-700 text-sm mt-1">
                  Placed on {new Date(createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />

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

export default OrderDetails;
