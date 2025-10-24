import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, removeErrors, removeSuccess } from '../feature/order/orderSlice';
import { clearCart } from '../feature/cart/cartSlice';

const Toast = ({ message, type = 'success', onClose }) => {
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
      ${type === 'success' ? 'bg-[#bef264] hover:bg-[#a5d64c]' : 'bg-red-500 hover:bg-red-600'}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">
          <i className={`bx ${type === 'success' ? 'bx-check' : 'bx-x'}`} />
        </span>
        <p className="font-bold">{message}</p>
      </div>
    </div>
  );
};

function PaymentSuccess() {
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  const { cartItems, shippingInfo } = useSelector(state => state.cart);
  const { loading, success, error } = useSelector(state => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    const createOrderData = async () => {
      try {
        const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
        if (!orderItem) return;

        const orderData = {
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            pinCode: shippingInfo.pinCode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItems: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: reference === 'COD' ? 'Pending' : 'Succeeded',
            method: reference === 'COD' ? 'COD' : 'Online',
          },
          itemPrice: orderItem.subtotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shippingCharges,
          totalPrice: orderItem.total,
        };

        dispatch(createOrder(orderData));
        sessionStorage.removeItem('orderItem');
      } catch (err) {
        setToast({ message: err.message || 'Order Creation Error', type: 'error' });
      }
    };

    createOrderData();
  }, [dispatch, cartItems, shippingInfo, reference]);

  useEffect(() => {
    if (success) {
      setToast({ message: 'Order Placed Successfully 🎉', type: 'success' });
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Payment Status" />
          <Navbar />
          

          <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-slate-50">
            <div className="bg-white rounded-2xl shadow-xl p-10 md:p-16 flex flex-col items-center text-center w-full max-w-md">
              <div className="w-24 h-24 md:w-26 md:h-26 bg-green-600 rounded-full flex items-center justify-center mb-6 relative animate-pulse">
                <svg
                  className="w-14 h-14 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-3xl font-bold text-green-600 mb-3">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-base md:text-lg mb-6">
                Your payment was successful. <br />
                Reference ID: <strong>{reference}</strong>
              </p>
              <Link
                to="/orders/user"
                className="px-6 py-3 bg-gradient-to-r from-[#bef264] to-[#a5d64c] hover:from-[#a5d64c] hover:to-[#bef264] hover:text-gray-800 text-white font-medium rounded shadow-md transition-all duration-300"
              >
                View Orders
              </Link>
            </div>
          </div>

          <Footer />

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </>
      )}
    </>
  );
}

export default PaymentSuccess;
