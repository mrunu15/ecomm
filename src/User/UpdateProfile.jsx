import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeErrors,
  removeSuccess,
  updateProfile,
} from "../feature/user/userSlice";
import Loader from "../components/Loader";

// ✅ Custom Toast Component (Alpine.js → React)
const Toast = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
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
      className={`fixed right-4 top-20 z-50 rounded-md px-4 py-3 text-gray-800 transition transform ${type === "success" ? "bg-[#bef264] hover:bg-[#a5d64c]" : "bg-red-500 hover:bg-red-600"
        }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl">
          <i className={`bx ${type === "success" ? "bx-check" : "bx-x"}`}></i>
        </span>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

function UpdateProfile() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");

  const [toast, setToast] = useState(null); // { message, type }

  const { user, error, success, message, loading } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.onerror = () => {
      setToast({ message: "Error reading file", type: "error" });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("lastName", lastName);
    myForm.set("email", email);
    myForm.set("phoneNumber", phoneNumber);
    myForm.set("address", address);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setToast({ message, type: "success" });
      dispatch(removeSuccess());
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    }
  }, [dispatch, success, message, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.lastName || "");
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber || "");
      setAddress(user.address || "");
      setAvatarPreview(user.avatar?.url || "/images/profile.png");
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center mt-10 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <form
              className="w-full space-y-6"
              encType="multipart/form-data"
              onSubmit={updateSubmit}
            >
              <h2 className="text-2xl font-bold text-center text-[#bef264] mb-6">
                Update Profile
              </h2>

              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                  />
                </div>

                {/* File Input */}
                <label className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#bef264] hover:bg-[#a5d64c] rounded-lg shadow-md cursor-pointer transition duration-200">
                  <i className="bx bx-upload text-lg mr-2"></i> Upload Avatar
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    className="hidden"
                    onChange={profileImageUpdate}
                  />
                </label>
              </div>


              {/* First Row: First Name & Last Name */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs "
                  >
                    First Name
                  </label>
                </div>
                <div className="w-full relative">
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder=" "
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="lastName"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs "
                  >
                    Last Name
                  </label>
                </div>
              </div>

              {/* Second Row: Email & Phone */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full relative">
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs "
                  >
                    Email
                  </label>
                </div>
                <div className="w-full relative">
                  <input
                    id="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder=" "
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900 
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs "
                  >
                    Phone Number
                  </label>
                </div>
              </div>

              {/* Third Row: Address */}
              <div className="w-full relative">
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder=" "
                  className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
                <label
                  htmlFor="address"
                  className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs "
                >
                  Address
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#bef264] text-white hover:text-gray-900 py-3 rounded-lg font-medium text-lg shadow-md hover:bg-[#a5d64c] transition-all duration-300"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Show Toast */}
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

export default UpdateProfile;
