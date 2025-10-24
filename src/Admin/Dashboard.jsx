import React, { useEffect, useState } from "react";
import {
  AddBox,
  AttachMoney,
  CheckCircle,
  Dashboard as DashboardIcon,
  Error,
  Instagram,
  Inventory,
  LinkedIn,
  People,
  ShoppingCart,
  Star,
  YouTube,
  QueryBuilder,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, fetchAllOrders } from "../feature/admin/adminSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductsList from "./ProductsList";
import CreateProduct from "./CreateProduct";
import UsersList from "./UsersList";
import OrdersList from "./OrdersList";
import ReviewsList from "./ReviewsList";
import ChatApp from "./ChatApp";
import ProductReviews from "./ProductReviews";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Dashboard() {

  const [youtubeData, setYoutubeData] = useState({ subscribers: 0, videos: 0 });

  useEffect(() => {
  const fetchYouTubeData = async () => {
    const API_KEY = "AIzaSyDbY8CHdp9KLoqlHbzG1-AWHOrqbyRPEgA"; 
    const CHANNEL_ID = "UCEJU13AmA9oe8JyVjUqvlKw"; 

    try {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const stats = res.data.items[0].statistics;
      setYoutubeData({
        subscribers: stats.subscriberCount,
        videos: stats.videoCount,
      });
    } catch (error) {
      console.error("YouTube API Error:", error);
    }
  };

  fetchYouTubeData();
}, []);

const [linkedinData, setLinkedinData] = useState({ firstName: "", lastName: "" });

useEffect(() => {
  const fetchLinkedinData = async () => {
    const ACCESS_TOKEN = "YOUR_LINKEDIN_ACCESS_TOKEN";

    try {
      const res = await axios.get("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      setLinkedinData({
        firstName: res.data.firstName.localized.en_US,
        lastName: res.data.lastName.localized.en_US,
      });
    } catch (err) {
      console.error("LinkedIn API Error:", err);
    }
  };

  fetchLinkedinData();
}, []);

  
  const { products, orders, totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // track active tab
  const [selectedProductId, setSelectedProductId] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const inStock = products.filter((p) => p.stock > 0).length;
  const totalReviews = products.reduce((acc, p) => acc + (p.reviews.length || 0), 0);

  // Sidebar buttons 
  const renderSidebar = () => (
    <aside className={`bg-gray-800 text-white p-5 transition-all duration-300 ease-in-out ${collapsed ? "w-20 md:w-20" : "w-64 md:w-64"} relative`}>
      <button onClick={() => setCollapsed(!collapsed)} className="absolute top-5 right-[-12px] bg-gray-800 border border-gray-700 rounded-full p-1 z-20 hover:bg-gray-700 transition">
        {collapsed ? <FiChevronRight className="text-white" /> : <FiChevronLeft className="text-white" />}
      </button>
      {/* <div className={`flex items-center gap-2 text-xl font-bold mb-8 border-b border-white pb-3 transition-all duration-300 ${collapsed ? "justify-center" : ""}`}>
        <DashboardIcon className="text-2xl" />
        {!collapsed && <span>Admin Dashboard</span>}
      </div> */}
      <button
        onClick={() => {
          setActiveTab("dashboard");
          // navigate("/admin/dashboard"); 
        }}
        className={`flex items-center gap-2 text-xl font-bold mb-8 border-b border-white pb-3 transition-all duration-300 w-full text-left ${collapsed ? "justify-center" : ""}`}
      >
        <DashboardIcon className="text-2xl" />
        {!collapsed && <span>Admin Dashboard</span>}
      </button>


      <nav className="flex flex-col gap-6">
        <div>
          <h3 className={`text-gray-400 text-xs uppercase tracking-wider mb-2 transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>Products</h3>
          <button onClick={() => {
            setActiveTab("allProducts");
            // navigate("/admin/products");
          }}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition  w-full text-left">
            <Inventory className="text-white text-xl" />
            {!collapsed && <span>All Products</span>}
          </button>
          <button onClick={() => {
            setActiveTab("createProduct");
            // navigate("/admin/product/create");
          }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left">
            <AddBox className="text-white text-xl" />
            {!collapsed && <span>Create Product</span>}
          </button>
        </div>

        <div>
          <button onClick={() => {
            setActiveTab("allUsers");
            // navigate("/admin/users");
          }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left">
            <People className="text-white text-xl" />
            {!collapsed && <span>All Users</span>}
          </button>
        </div>

        <div>
          <button onClick={() => {
            setActiveTab("allOrders");
            // navigate("/admin/orders");
          }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left">
            <ShoppingCart className="text-white text-xl" />
            {!collapsed && <span>All Orders</span>}
          </button>
        </div>

        <div>
          <button onClick={() => {
            setActiveTab("allReviews");
            // navigate("/admin/reviews");
          }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left">
            <Star className="text-white text-xl" />
            {!collapsed && <span>All Reviews</span>}
          </button>
        </div>

        <div>
          <button onClick={() => {
            setActiveTab("querySection");
            // navigate("admin/chat");
          }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left">
            <QueryBuilder className="text-white text-xl" />
            {!collapsed && <span>Query Section</span>}
          </button>
        </div>
      </nav>
    </aside>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
              {[{ icon: Inventory, color: "text-blue-500", label: "Total Products", value: totalProducts },
              { icon: ShoppingCart, color: "text-yellow-500", label: "Total Orders", value: totalOrders },
              { icon: Star, color: "text-pink-500", label: "Total Reviews", value: totalReviews },
              { icon: AttachMoney, color: "text-green-500", label: "Total Revenue", value: `${totalAmount.toFixed(2)}/-` },
              { icon: Error, color: "text-red-500", label: "Out Of Stock", value: outOfStock },
              { icon: CheckCircle, color: "text-green-600", label: "In Stock", value: inStock }].map((stat, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                  <stat.icon className={`${stat.color} text-3xl mb-3`} />
                  <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-8 lg:grid-cols-3 gap-6">
              {[
                { icon: Instagram, color: 'text-pink-600', title: 'Instagram', followers: '123K', posts: '12' },
                { icon: LinkedIn, color: 'text-blue-700', title: 'LinkedIn', followers: '55K', posts: '6' },
                { icon: YouTube, color: 'text-red-600', title: 'YouTube', followers: youtubeData.subscribers, posts: youtubeData.videos }
              ].map((social, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 text-center">
                  <social.icon className={`${social.color} text-4xl mb-2 mx-auto`} />
                  <h3 className="text-gray-800 font-semibold text-lg">{social.title}</h3>
                  <p className="text-gray-500">{social.followers} Followers</p>
                  <p className="text-gray-500">{social.posts} posts</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "allProducts":
        return <div><ProductsList /></div>;
      case "createProduct":
        return <div className="bg-white rounded-xl "><CreateProduct /></div>;
      case "allUsers":
        return <div><UsersList /></div>;
      case "allOrders":
        return <div><OrdersList /></div>;
      case "allReviews":
        // return <div><ReviewsList /></div>;
        return (
          <ReviewsList
            onViewProductReviews={(productId) => {
              setSelectedProductId(productId);
              setActiveTab("productReviews");
            }}
          />
        );
      case "productReviews":
        return (
          <ProductReviews
            productId={selectedProductId}
            onBack={() => setActiveTab("allReviews")}
          />
        );
      case "querySection":
        return <div><ChatApp /></div>;
      default:
        return null;
    }
  };

  return (
    <>

      {/* <Navbar />
      <PageTitle title="Admin Dashboard" /> */}

      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <Navbar />
        <PageTitle title="Admin Dashboard" />
      </div>

      {/* <div className="flex min-h-screen transition-all duration-300 pt-16 bg-gradient-to-r from-[#e5f4fb] to-[#d4f1fe]"
      style={{overflow: "hidden"}}> */}
      <div className="flex min-h-screen transition-all duration-300 pt-16 bg-gradient-to-r from-[#e5f4fb] to-[#d4f1fe]"
        style={{ overflow: "hidden" }}>

        {renderSidebar()}
        {/* <main
          className={`flex-1 p-6 transition-all duration-300 ${collapsed ? "md:ml-6 ml-6" : "md:ml-6 ml-6"}`}
        > */}
        <main
          className={`flex-1 py-8 px-3  transition-all duration-300 bg-gradient-to-r from-[#e5f4fb] to-[#d4f1fe] sm:px-4 md:px-6 lg:px-8 ${collapsed ? 'md:ml-1 ml-1' : 'md:ml-1 ml-1'}`}
          style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
      main::-webkit-scrollbar {
        display: none;
      }
    `}
          </style>


          {/* {renderContent()} */}
        <div className="w-full ">
    {renderContent()}
  </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;

