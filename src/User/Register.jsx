import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../feature/user/userSlice';
import imgg from "../assets/imgg.jpg";
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';

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

function Register() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('./836.jpg');
  const [toast, setToast] = useState(null); // ✅ local toast state

  const { success, loading, error } = useSelector(
    (state) => state.user || { success: false, loading: false, error: null }
  );

  const { name, email, password } = user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToast({ message: 'Please fill out all the required fields', type: 'error' });
      return;
    }
    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('avatar', avatar);
    dispatch(register(myForm));
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setToast({ message: 'Registration Successful', type: 'success' });
      dispatch(removeSuccess());
      setTimeout(() => navigate('/'), 1500); 
    }
  }, [dispatch, success, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-20 p-4 mt-16 lg:mt-16">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">

          {/* Left Visual */}
          <div className="md:w-1/2 relative flex items-center justify-center">
            <img
              src={imgg}
              alt="clothes"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 p-8 w-full max-w-sm text-center text-white">
              <h2 className="text-2xl font-bold mb-4">GET STARTED</h2>
            </div>
          </div>

          {/* Register Form */}
          <div className="md:w-1/2 p-8 bg-gray-100">
            <div className="flex justify-end gap-2 mb-6">
              <Link
                to="/login"
                className="relative inline-block px-4 py-1 text-sm font-medium rounded border border-[#bef264] text-gray-900 overflow-hidden
             before:absolute before:inset-0 before:bg-[#bef264] before:w-0 before:h-full before:left-0 before:top-0
             before:transition-all before:duration-300 before:ease-in-out hover:before:w-full"
              >
                <span className="relative z-10">Login</span>
              </Link>
              <span className="bg-[#bef264] text-gray-900 font-medium text-sm px-4 py-1 rounded">
                Register
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Register</h2>
            <form onSubmit={registerSubmit} encType="multipart/form-data" className="space-y-6">

              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={registerDataChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                   focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 top-3 px-1 bg-gray-100 text-gray-900 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                   peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
                   peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id='email'
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                   focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label 
                  htmlFor='email'
                  className="absolute left-3 top-3 px-1 bg-gray-100 text-gray-900 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                   peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
                   peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  E-mail
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id='password'
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                  placeholder=" "
                  required
                  className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                   focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label
                  htmlFor='password'
                  className="absolute left-3 top-3 px-1 bg-gray-100 text-gray-900 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                   peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
                   peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                >
                  Password
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                  className="block text-sm text-gray-500"
                />
                <div className="flex justify-start">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border object-cover"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full bg-[#bef264] hover:bg-[#a5d64c] text-white hover:text-gray-900 font-semibold py-2 rounded-lg"
              >
                {loading ? "Signing Up..." : "Sign Up"}
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
}

export default Register;
