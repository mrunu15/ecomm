import React, { useEffect, useState } from "react";
import { toast, Slide, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addItemsToCart,
  removeErrors,
  removeItemFromCart,
  removeMessage,
} from "../feature/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

function CartItem({ item }) {
  const { success, loading, error, message } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  // Ensure item exists
  if (!item) return null;

  const [quantity, setQuantity] = useState(item.quantity || 1);

  // Update quantity immediately when changed
  const updateQuantity = (newQty) => {
    if (loading) return;
    setQuantity(newQty);
    dispatch(addItemsToCart({ id: item.product, quantity: newQty }));
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("⚠️ Quantity cannot be less than 1", {
        position: "bottom-left",
        transition: Bounce,
        autoClose: 2500,
      });
      dispatch(removeErrors());
      return;
    }
    updateQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if ((item.stock || 0) <= quantity) {
      toast.error("❌ Cannot exceed available stock!", {
        position: "bottom-left",
        transition: Bounce,
        autoClose: 2500,
      });
      dispatch(removeErrors());
      return;
    }
    updateQuantity(quantity + 1);
  };

  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong", {
        position: "bottom-left",
        transition: Slide,
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        position: "bottom-left",
        transition: Bounce,
        toastId: "cart-update",
        autoClose: 2000,
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(item.product));
    toast.success("🗑️ Item removed from cart", {
      position: "bottom-left",
      transition: Slide,
      autoClose: 2000,
    });
  };

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-4 items-center gap-6 border rounded-xl p-6 shadow-md hover:shadow-lg transition-all bg-white">
        {/* Product Info */}
        <div className="flex items-center gap-4 w-full">
          <img
            src={item.image || ""}
            alt={item.name || "Product"}
            className="w-20 h-20 object-cover rounded-lg shadow-md"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {item.name || "Product Name"}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              <strong>Price:</strong> ₹{item.discountPrice.toFixed(2)}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Stock:</strong> {item.stock || 0}
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={decreaseQuantity}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
          >
            <FiMinus className="text-gray-700" />
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            min="1"
            className="w-12 text-center border rounded-md py-1 font-medium text-gray-700"
          />
          <button
            onClick={increaseQuantity}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
          >
            <FiPlus className="text-gray-700" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-center text-gray-800 font-semibold text-lg">
          ₹{(item.discountPrice * quantity).toFixed(2)}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white text-sm font-medium rounded-md shadow hover:bg-red-600 transition disabled:opacity-50"
          >
            <FiTrash2 /> Remove
          </button>
        </div>
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default CartItem;
