import React from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import CheckoutPath from "./CheckoutPath";
import { useNavigate } from "react-router-dom";

function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shippingCharges = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shippingCharges;

  const navigate = useNavigate();

  const proceedToPayment = () => {
    const data = { subtotal, tax, shippingCharges, total };
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <>
      <PageTitle title="Order Confirm" />
      <Navbar />
      <CheckoutPath activePath={1} />

      <div className="max-w-7xl mx-auto mt-12 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Order Confirmation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Shipping + Cart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Shipping Details
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {shippingInfo.phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {shippingInfo.address}, {shippingInfo.city},{" "}
                  {shippingInfo.state}, {shippingInfo.country} -{" "}
                  {shippingInfo.pinCode}
                </p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Cart Items
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between gap-4 border-b pb-4"
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
                    <div className="text-right">
                      <p className="text-gray-800 font-semibold">
                        ₹{(item.discountPrice * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-red-600 text-sm font-semibold line-through decoration-black">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-700">
                <p>Shipping Charges</p>
                <p>₹{shippingCharges.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-700">
                <p>GST (18%)</p>
                <p>₹{tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3 text-gray-800">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={proceedToPayment}
              className="w-full mt-6 px-6 py-3 bg-[#bef264] hover:bg-[#a5d64c] text-gray-800 font-semibold rounded-xl shadow transition-all duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderConfirm;
