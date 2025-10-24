import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, removeErrors, removeSuccess } from "../feature/user/userSlice";
import Loader from "../components/Loader";

// Custom Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed right-4 top-20 z-[10000] rounded-md px-4 py-2 text-gray-900 transition transform shadow-lg
      ${type === "success" ? "bg-[#bef264] hover:bg-[#a5d64c]" : "bg-red-500 hover:bg-red-600"}`}
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

function ForgotPassword() {
  const { loading, error, success, message } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);

  const forgotPasswordEmail = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setToast({ message: message, type: "success" });
      dispatch(removeSuccess());
    }
  }, [dispatch, success, message]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Forgot Password" />
          <Navbar />

          <div className="flex items-center justify-center min-h-[70vh] mt-6 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-medium text-center text-black mb-6">
                Forgot Password
              </h2>

              <form className="space-y-6" onSubmit={forgotPasswordEmail}>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                    focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                    peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                  >
                    Enter your registered email
                  </label>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full bg-[#bef264] rounded-lg text-white py-2 font-medium text-lg shadow-md hover:bg-[#a5d64c] transition-all duration-300"
                  >
                    Send
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-md text-gray-500">
                Remember your password?
                <a href="/login" className="ml-2 text-gray-900 hover:underline">
                  Login
                </a>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default ForgotPassword;
