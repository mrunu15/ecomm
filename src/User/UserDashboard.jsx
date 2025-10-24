import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout, removeSuccess } from "../feature/user/userSlice";

const Toast = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(true);

  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 2000);
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

function UserDashboard({ user }) {
  // const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [toast, setToast] = useState(null);

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  // function orders() {
  //   navigate("/orders/user");
  //   setMenuVisible(false);
  // }

  function profile() {
    navigate("/profile");
    setMenuVisible(false);
  }

  // function myCart() {
  //   navigate("/cart");
  //   setMenuVisible(false);
  // }

 function logoutUser() {
  dispatch(logout())
    .unwrap()
    .then(() => {
      setToast({ message: "Logout Successful", type: "success" });
      dispatch(removeSuccess());

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    })
    .catch((error) => {
      setToast({
        message: error.message || "Logout Failed",
        type: "error",
      });
    })
    .finally(() => {
      setMenuVisible(false);
    });
}


  function dashboard() {
    navigate("/admin/dashboard");
    setMenuVisible(false);
  }

  const options = [
    { name: "Account", funcName: profile },
    { name: "Logout", funcName: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      name: "Admin Dashboard",
      funcName: dashboard,
    });
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity z-[999] ${
          menuVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      ></div>

      <div className="relative">
        <div
          onClick={toggleMenu}
          className="flex items-center cursor-pointer fixed lg:top-3 top-2 right-[100px] sm:right-[120px] lg:right-[340px] p-2 md:p-1.5 z-[1000] transition-colors"
        >
          <img
            src={user.avatar.url ? user.avatar.url : "./images/profile.png"}
            alt="Profile"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-300 mr-3"
          />
        </div>

        <AnimatePresence>
          {menuVisible && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="fixed top-20 right-5 md:right-[50px] rounded-lg p-3 w-44 z-[1000]"
            >
              {options.map((item) => (
                <motion.button
                  key={item.name}
                  variants={itemVariants}
                  onClick={item.funcName}
                  className="w-full py-2.5 mb-2 rounded-lg text-base font-medium shadow-sm bg-[#bef264] text-white hover:bg-[#a5d64d] hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

export default UserDashboard;
