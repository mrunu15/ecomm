// import React from 'react';
// import PageTitle from '../components/PageTitle';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import CheckoutPath from './CheckoutPath';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';

// function Payment() {
//   const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
//   const { user } = useSelector(state => state.user);
//   const { shippingInfo } = useSelector(state => state.cart);
//   const navigate = useNavigate();

//   const completePayment = async (amount) => {
//     try {
//       const { data: keyData } = await axios.get('/api/v1/getKey');
//       const { key } = keyData;

//       const { data: orderData } = await axios.post('/api/v1/payment/process', { amount });
//       const { order } = orderData;

//       const options = {
//         key,
//         amount,
//         currency: 'INR',
//         name: 'ShopEasy',
//         description: 'Ecommerce Website Payment Transaction',
//         order_id: order.id,
//         handler: async function(response) {
//           const { data } = await axios.post('/api/v1/paymentVerification', {
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature
//           });

//           if(data.success) {
//             navigate(`/paymentSuccess?reference=${data.reference}`);
//           } else {
//             alert('Payment verification Failed');
//           }
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//           contact: shippingInfo.phoneNumber
//         },
//         theme: {
//           color: '#3399cc'
//         },
//       };

//       const rzp = new Razorpay(options);
//       rzp.open();
//     } catch(error) {
//       toast.error(error.message, { position: 'top-center', autoClose: 3000 });
//     }
//   }

//   return (
//     <>
//       <PageTitle title="Payment Processing" />
//       <Navbar />
//       <CheckoutPath activePath={2} />

//       <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 mt-10 min-h-[40vh] px-4">
//         <Link
//           to="/order/confirm"
//           className="px-6 py-3 rounded-lg border-2 border-[#5ac8fa] text-gray-800 font-medium hover:bg-[#5ac8fa] hover:text-white transition-all duration-300 text-center w-full md:w-auto"
//         >
//           Go Back
//         </Link>

//         <button
//           onClick={() => completePayment(Number(orderItem.total.toFixed(2)))}
//           className="px-6 py-3 rounded-lg bg-[#5ac8fa] hover:bg-[#7cd1f8] hover:text-gray-800 text-white font-semibold transition-all duration-300 w-full md:w-auto shadow-lg"
//         >
//           Pay ₹{Number(orderItem.total).toFixed(2)}/-
//         </button>
//       </div>

//       <Footer />
//     </>
//   )
// }

// export default Payment;
import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutPath from './CheckoutPath';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';


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
      className={`fixed right-4 top-20 z-[10000] rounded-md px-4 py-3 text-gray-900 shadow-lg transition transform
      ${type === 'success' ? 'bg-gradient-to-r from-[#bef264] to-[#a5d64c]' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
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

function Payment() {
  const orderItem = JSON.parse(sessionStorage.getItem('orderItem'));
  const { user } = useSelector(state => state.user);
  const { shippingInfo } = useSelector(state => state.cart);
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [codChecked, setCodChecked] = useState(false);

  // ✅ Online Payment
  const completePayment = async (amount) => {
    try {
      const { data: keyData } = await axios.get('/api/v1/getKey');
      const { key } = keyData;

      const { data: orderData } = await axios.post('/api/v1/payment/process', { amount });
      const { order } = orderData;

      const options = {
        key,
        amount,
        currency: 'INR',
        name: 'ShopEasy',
        description: 'Ecommerce Website Payment Transaction',
        order_id: order.id,
        handler: async function(response) {
          const { data } = await axios.post('/api/v1/paymentVerification', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });

          if (data.success) {
            setToast({ message: 'Payment Successful 🎉', type: 'success' });
            setTimeout(() => navigate(`/paymentSuccess?reference=${data.reference}`), 1500);
          } else {
            setToast({ message: 'Payment verification Failed', type: 'error' });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNumber
        },
        theme: {
          color: '#3399cc'
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      setToast({ message: error.response?.data?.message || error.message, type: 'error' });
    }
  };

  // ✅ Cash on Delivery
  const handleCOD = async () => {
    if (!codChecked) {
      setToast({ message: 'Please confirm COD by checking the box ✅', type: 'error' });
      return;
    }

    try {
      const { data } = await axios.post('/api/v1/payment/cod', {
        amount: Number(orderItem.total.toFixed(2))
      });

      if (data.success) {
        setToast({ message: 'Order placed successfully with COD 🎉', type: 'success' });
        setTimeout(() => navigate(`/paymentSuccess?reference=COD`), 1500);
      } else {
        setToast({ message: 'COD Order Failed. Try again.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: error.response?.data?.message || error.message, type: 'error' });
    }
  };

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
    

      <div className="flex flex-col items-center justify-center gap-6 mt-10 px-4 md:flex-row md:gap-10">
        {/* Go Back Button */}
        <Link
          to="/order/confirm"
          className="px-6 py-3 rounded-lg border-2 border-[#bef264] text-gray-800 font-medium hover:bg-[#a5d64c] hover:text-white transition-all duration-300 w-full md:w-auto text-center shadow-md"
        >
          Go Back
        </Link>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <button
            onClick={() => completePayment(Number(orderItem.total.toFixed(2)))}
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#bef264] to-[#a5d64c] hover:from-[#a5d64c] hover:to-[#bef264] text-gray-900 font-semibold transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
          >
            <i className="bx bx-credit-card text-lg"></i>
            Pay Online ₹{Number(orderItem.total).toFixed(2)}/-
          </button>

          <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={codChecked}
                onChange={() => setCodChecked(!codChecked)}
                className="w-5 h-5 accent-[#bef264] cursor-pointer"
              />
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                I confirm Cash on Delivery (COD)
              </span>
            </div>
            <button
              onClick={handleCOD}
              className="mt-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#bef264] to-[#a5d64c] hover:from-[#a5d64c] hover:to-[#bef264] text-gray-900 font-semibold transition-all duration-300 shadow-lg w-full"
            >
              Cash on Delivery
            </button>
          </div>
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
  );
}

export default Payment;
