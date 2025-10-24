import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  ShoppingCart,
  Lock,
  Edit,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { logout } from "../feature/user/userSlice";
import Order from "../Orders/Order";
import UpdatePassword from "../User/UpdatePassword";
import EditProfile from "../User/UpdateProfile";

function Profile() {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = "/login";
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="bg-white mt-10 dark:bg-gray-800 shadow rounded-xl p-4 md:p-6 space-y-6">
            <PageTitle title="Account Setting" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                defaultValue={user.name || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-transparent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                defaultValue={user.lastName || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-transparent focus:outline-none"
              />
              <div className="flex items-center border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  defaultValue={user.email}
                  readOnly
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  defaultValue={user.phoneNumber || ""}
                  readOnly
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center border rounded-lg p-3  dark:border-gray-600 md:col-span-2 bg-gray-50 dark:bg-gray-700">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Address"
                  defaultValue={user.address || ""}
                  readOnly
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center border rounded-lg p-3  dark:border-gray-600 md:col-span-2 bg-gray-50 dark:bg-gray-700">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={
                    user.createdAt
                      ? String(user.createdAt).substring(0, 10)
                      : "N/A"
                  }
                  readOnly
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        );
      case "orders":
        return <Order />;
      case "password":
        return <UpdatePassword />;
      case "edit":
        return <EditProfile />;
      default:
        return null;
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      {/* Container */}
      <div className="flex flex-col md:flex-row min-h-screen mt-16 bg-white dark:bg-gray-900">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center py-6">
            <img
              src={user.avatar?.url || "./images/profile.png"}
              alt="User"
              className="w-20 h-20 rounded-full object-cover border shadow-sm"
            />
            <h2 className="mt-3 font-semibold text-gray-800 dark:text-white text-center">
              {user.name} {user.lastName}
            </h2>
            
          </div>

          <nav className="flex flex-col px-4 gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                activeTab === "account"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5" /> <span>Account Settings</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                activeTab === "orders"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5" /> <span>My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                activeTab === "password"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Lock className="w-5 h-5" /> <span>Password</span>
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                activeTab === "edit"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Edit className="w-5 h-5" /> <span>Edit Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <LogOut className="w-5 h-5" /> <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Mobile tab nav */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex gap-4 px-4 py-3 text-sm font-medium whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg ${
                activeTab === "account"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span>Account</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg ${
                activeTab === "orders"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5 mb-1" />
              <span>Orders</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg ${
                activeTab === "password"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Lock className="w-5 h-5 mb-1" />
              <span>Password</span>
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg ${
                activeTab === "edit"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Edit className="w-5 h-5 mb-1" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5 mb-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">{renderContent()}</main>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
