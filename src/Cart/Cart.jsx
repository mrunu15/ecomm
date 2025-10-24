import React from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const totalprice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shippingCharges = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shippingCharges;
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (user) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Your Cart" />

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <p className="text-xl font-medium text-red-500 mb-6">
            Your cart is empty ⚠️
          </p>
          <Link
            to="/products"
            className="px-6 py-2 bg-[#bef264] text-white font-semibold text-lg shadow-md rounded hover:bg-[#a5d64c] transition"
          >
            View Products
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-white rounded-xl mt-10 shadow p-6 min-h-[50vh]">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">
              Your Cart
            </h2>

            <div className="hidden md:grid grid-cols-4 bg-gray-50 rounded-lg font-semibold text-gray-600 px-4 py-3 mb-4">
              <div>Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Item Total</div>
              <div className="text-center">Actions</div>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <CartItem item={item} key={item.product} />
              ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-fit sticky mt-10 top-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-6">
              Price Summary
            </h3>
            <div className="flex justify-between mb-3">
              <p className="text-gray-600">Price :</p>
              <p className="font-medium text-red-500 line-through">
                ₹{totalprice.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-gray-600 mb-3">
              <p>DiscountPrice :</p>
              <p className="font-medium">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-600 mb-3">
              <p>Tax (18%):</p>
              <p className="font-medium">₹{tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-600 mb-3">
              <p>Shipping :</p>
              <p className="font-medium">₹{shippingCharges.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-900 font-semibold text-lg border-t pt-4 mt-4">
              <p>Total :</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={checkoutHandler}
                className="w-2/3 mt-6 bg-[#bef264] text-white py-2 font-semibold text-md shadow-md hover:bg-[#a5d64c] hover:text-gray-900 transition"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;
