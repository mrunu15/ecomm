import React, { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, removeSuccess, resetPassword } from "../feature/user/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

function ResetPassword() {
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const data = { password, confirmPassword };
    dispatch(resetPassword({ token, userData: data }));
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setToast({ message: "Password Reset Successful", type: "success" });
      dispatch(removeSuccess());
      setTimeout(() => navigate("/login"), 1500); // Navigate after toast shows
    }
  }, [dispatch, success, navigate]);

  return (
    <>
      <Navbar />
      <PageTitle title="Reset Password" />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 className="text-2xl font-medium text-center text-gray-800 mb-8">
            Reset Password
          </h2>

          <form onSubmit={resetPasswordSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Enter your new password
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                required
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                 peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Confirm password
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-[#bef264] hover:text-gray-900 text-white font-semibold shadow-md 
                 hover:bg-[#a5d64c] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default ResetPassword;
