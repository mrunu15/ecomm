// src/pages/Return.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyOrders } from "../feature/order/orderSlice";
import Loader from "../components/Loader";

const Return = () => {
  const { orderId } = useParams(); // ✅ only orderId now
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const foundOrder = orders.find((o) => o._id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [orders, orderId]);

  if (loading || !order) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row items-start gap-8 p-6 md:p-10 mt-20 w-full max-w-6xl mx-auto bg-white shadow-md rounded-2xl">
        {/* Left Section */}
        <div className="flex flex-col items-start w-full md:w-1/2">
          {/* Order Items */}
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mb-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-contain border rounded-md shadow-sm"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">Order #{order._id}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × ₹{order.itemPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Timeline */}
          <div className="relative border-l-2 border-gray-300 pl-6">
            <div className="mb-10 relative">
              <div className="absolute -left-6 w-5 h-5 bg-[#bef264] rounded-full border-2 border-white shadow-md"></div>
              <p className="font-semibold text-[#4d7c0f]">Return started</p>
              <p className="text-sm text-gray-500">
                Request received on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="mb-10 relative">
              <div className="absolute -left-6 w-5 h-5 bg-white rounded-full border-2 border-gray-400"></div>
              <p className="text-gray-700">Drop off the item within 7 days</p>
            </div>
            <div className="mb-10 relative">
              <div className="absolute -left-6 w-5 h-5 bg-white rounded-full border-2 border-gray-400"></div>
              <p className="text-gray-700">Refund after item is received</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 space-y-5">
          <div className="border rounded-lg p-5 shadow-md bg-gray-50">
            <h2 className="font-semibold text-lg mb-3">Refund summary</h2>
            <div className="mt-4 text-sm space-y-2">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="mb-2">
                  <div className="flex justify-between">
                    <span>{item.name} (×{item.quantity})</span>
                    <span>₹{(order.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Price:</span>
                    <span className="text-red-600">-₹{order.taxPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                <span>Estimated total refund</span>
                <span>₹{order.itemPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border rounded-lg p-5 shadow-md bg-gray-50">
            <h2 className="font-semibold text-lg mb-3">Shipping Details</h2>
            <p className="text-sm text-gray-700">
              {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
              {order.shippingInfo.state}, {order.shippingInfo.country} -{" "}
              {order.shippingInfo.pinCode}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Phone: {order.shippingInfo.phoneNo}
            </p>
          </div>

          <Link
            to="/products"
            className="block text-center px-6 py-2 bg-[#bef264] hover:bg-[#a5d64c] rounded-lg text-sm font-medium text-gray-800 shadow-md transition-all duration-300"
          >
            Continue
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Return;
