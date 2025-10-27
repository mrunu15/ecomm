import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { checktoken, login, removeErrors } from "../feature/user/userSlice";
import { motion } from "framer-motion";
import imgg1 from "../assets/imgg1.jpg";
import { LogOut } from "lucide-react";

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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user || {}
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [toast, setToast] = useState(null); 

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };
  const handleCheckToken = () => {
      dispatch(checktoken());
    };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
    if (isAuthenticated) {
      setToast({ message: "Login Successful", type: "success" });
      setTimeout(() => navigate("/"), 1500); 
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 mt-10 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 relative flex items-center justify-center">
            <img
              src={imgg1}
              alt="login visual"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 p-8 w-full max-w-sm text-center text-white">
              <h2 className="text-2xl font-bold mb-4">WELCOME BACK</h2>
              <p className="text-sm mb-4">
                Login to access your account and start shopping.
              </p>
              <Link
                to="/password/forgot"
                className="text-white text-md underline hover:text-gray-200 transition"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 p-8 bg-gray-100">
            <div className="flex justify-end gap-2 mb-6">
              <span className="bg-[#bef264] text-gray-900 text-sm font-medium px-4 py-1 rounded">
                Login
              </span>
              <Link
                to="/register"
                className="relative inline-block px-4 py-1 text-sm font-medium rounded border border-[#bef264] text-gray-900 overflow-hidden
             before:absolute before:inset-0 before:bg-[#bef264] before:w-0 before:h-full before:left-0 before:top-0
             before:transition-all before:duration-300 before:ease-in-out hover:before:w-full"
              >
                <span className="relative z-10">Register</span>
              </Link>
            </div>
            

            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            <form onSubmit={loginSubmit} className="space-y-6">
              {/* Email */}
              <div className="w-full relative">
                <input
                  type="email"
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
               focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label
                  htmlFor="loginEmail"
                  className="absolute left-3 top-3 px-1 bg-gray-100 text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  E-mail
                </label>
              </div>

              <div className="w-full relative">
                <input
                  type="password"
                  id="loginPassword"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder=" "
                  required
                  className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
               focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label
                  htmlFor="loginPassword"
                  className="absolute left-3 top-3 px-1 bg-gray-100 text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  Enter Password
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full bg-[#bef264] hover:bg-[#a5d64c] rounded-lg text-white hover:text-gray-900 font-semibold py-2"
              >
                {loading ? "Logging In..." : "Login"}
              </motion.button>
            </form>
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
};

export default Login;
