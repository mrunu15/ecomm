import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../feature/order/orderSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  removeErrors,
  removeSuccess,
  updateOrderStatus,
} from "../feature/admin/adminSlice";

function UpdateOrder() {
  const [status, setStatus] = useState("");
  const { orderId } = useParams();
  const { order, loading: orderLoading } = useSelector(
    (state) => state.order
  );
  const { success, loading: adminLoading, error } = useSelector(
    (state) => state.admin
  );
  const loading = orderLoading || adminLoading;
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    itemPrice,
    taxPrice,
    shippingPrice,
    user = {},
  } = order;

  let paymentStatus = "Not Paid";
  if (paymentInfo.method === "COD") {
    paymentStatus =
      paymentInfo.status?.toLowerCase() === "pending" ? "Pending" : "Paid";
  } else if (paymentInfo.method === "Online") {
    paymentStatus =
      paymentInfo.status?.toLowerCase() === "succeeded" ? "Paid" : "Not Paid";
  }

  const finalOrderStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  const handleStatusUpdate = () => {
    if (!status) {
      toast.error("Please select a status", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(updateOrderStatus({ orderId, status }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Order Status updated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, error, success, orderId]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update Order" />

      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-6xl mx-auto mt-28 p-6 sm:p-8 bg-gray-50 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Update Order
          </h1>

          
          <div className="grid lg:grid-cols-2 gap-8">
           
            <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-4">
                Order Information
              </h2>
              <p>
                <span className="font-semibold">Order ID:</span> {orderId}
              </p>
              <p>
                <span className="font-semibold">Customer:</span> {user.name} (
                {user.email})
              </p>
              <p>
                <span className="font-semibold">Shipping Address:</span>{" "}
                {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.state}, {shippingInfo.country} -{" "}
                {shippingInfo.pinCode}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {shippingInfo.phoneNo}
              </p>
              <p>
                <span className="font-semibold">Order Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    finalOrderStatus === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : finalOrderStatus === "Processing"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {finalOrderStatus}
                </span>
              </p>
              <p>
                <span className="font-semibold">Payment Method:</span>{" "}
                {paymentInfo.method}
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    paymentStatus === "Paid"
                      ? "bg-green-100 text-green-600"
                      : paymentStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {paymentStatus}
                </span>
              </p>
            </div>

            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{itemPrice?.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{taxPrice?.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}
                  </span>
                </p>
                <p className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total:</span>
                  <span>₹{totalPrice?.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          
          <div className="mt-10 bg-white rounded-xl shadow-md p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-4">
              Order Items
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-center">
                      <p className="text-red-500 text-sm font-semibold line-through decoration-black">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <p className="text-green-600 font-bold">
                        ₹{itemPrice.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="mt-10 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-4">
              Update Status
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading || orderStatus === "Delivered"}
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="On The Way">On The Way</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                className={`px-6 py-2 rounded text-white font-medium transition-all duration-300 ${
                  loading || !status || orderStatus === "Delivered"
                    ? "bg-red-200 cursor-not-allowed"
                    : "bg-[#bef264] hover:bg-[#a5d64c] shadow-md"
                }`}
                onClick={handleStatusUpdate}
                disabled={loading || !status || orderStatus === "Delivered"}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default UpdateOrder;
