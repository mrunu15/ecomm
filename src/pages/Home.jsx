"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageSlider from "../components/ImageSlider";
import CategoryGrid from "./CategoryGrid";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../feature/products/productSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import BrandSlider from "../components/BrandSlider";
import Offer from "../components/Offer";
import { motion, AnimatePresence } from "framer-motion";
import Testireview from "../components/Testireview";
import Subscribe from "./Subscribe";
import shoes from "../assets/imgg.jpg";
import lower from "../assets/lower.jpg";
import tshirt from "../assets/tshirt.jpg";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, X, Edit3, MoreHorizontal } from "lucide-react";
import axios from "axios";

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

const LiveChat = ({ isOpen, onClose, userId, token }) => {
  const { user } = useSelector((state) => state.user); 
  const username = user?.name || user?.username || "there";
  const avatarSrc =
  user?.profilePic ||
  user?.image ||
  user?.avatar?.url ||  
  user?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  
  const [phase, setPhase] = useState("idle");
  const [showOptions, setShowOptions] = useState(false);
  const [autoTimers, setAutoTimers] = useState([]); // stores timeout IDs to cleanup
  const [autoFlowStarted, setAutoFlowStarted] = useState(false);

  
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());


  const firstStageTopics = [
    "Order Status or Tracking",
    "Returns, Exchanges, or Refunds",
    "Product/Inventory Question",
    "Payment or Billing Issue",
    "Something else (Connect with a human agent)",
  ];

  
  useEffect(() => {
    if (isOpen && userId) {
      fetchMessages();
    }
  }, [isOpen, userId]);


  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
      
      if (!autoFlowStarted) {
        startInitialAutoFlow();
      }
    }
  };

  
  const startInitialAutoFlow = () => {
    
    autoTimers.forEach((t) => clearTimeout(t));
    const timers = [];

    
    const t1 = setTimeout(() => {
      appendBotMessage("auto1", `Hello ${username}! Thanks for visiting us. Welcome to our support chat! I'm your virtual support assistant, ready to help.`);
    }, 200);
    timers.push(t1);

    
    const t2 = setTimeout(() => {
      appendBotMessage("auto2", "To get the fastest answer, tell me what you need help with?");
      setPhase("greetingShown");
     
    }, 1700);
    timers.push(t2);

    setAutoTimers(timers);
    setAutoFlowStarted(true);
    setLastInteractionTime(Date.now());
    setShowOptions(false);
  };

  
  const appendBotMessage = (id, text) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === id)) return prev;
      return [
        ...prev,
        {
          _id: id,
          sender: "bot",
          message: text,
          createdAt: new Date(),
        },
      ];
    });
  };

  
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const newMsg = {
      _id: Date.now().toString(),
      sender: "user",
      message: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLastInteractionTime(Date.now());

    try {
      // send to server (preserve your backend flow)
      await axios.post(
        "/api/chat/send",
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }

    
    if (phase === "greetingShown" || phase === "idle") {
      
      setTimeout(() => {
        appendBotMessage("auto3", "Here are our most popular help topics:");
        setShowOptions(true);
        setPhase("optionsShown");
      }, 900);
      return;
    }

    
    if (phase === "optionsShown") {
      
      setShowOptions(false);
      setTimeout(() => {
        appendBotMessage(
          "auto4",
          `Thanks! We've received your request about "${text}". A member of our Customer Care team will join this chat to assist you personally very soon.`
        );
        setPhase("done");
      }, 900);
      return;
    }

    
  };


  const handleOptionClick = async (topic) => {

    const newMsg = {
      _id: Date.now().toString(),
      sender: "user",
      message: topic,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setLastInteractionTime(Date.now());

    try {

      await axios.post(
        "/api/chat/send",
        { message: topic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error sending option choice:", err);
    }

    setShowOptions(false);


    setTimeout(() => {
      appendBotMessage(
        "auto4",
        `Thanks! We've received your request about "${topic}". A member of our Customer Care team will join this chat to assist you personally very soon.`
      );
      setPhase("done");
    }, 800);
  };

  useEffect(() => {
    
    const elapsed = Date.now() - lastInteractionTime;
    const remaining = 3600000 - elapsed; 

    if (remaining <= 0) {
   
      resetChatToInitial();
      return;
    }

    const t = setTimeout(() => {
      resetChatToInitial();
    }, remaining);

    return () => clearTimeout(t);
    
  }, [lastInteractionTime]);

  const resetChatToInitial = () => {
  
    autoTimers.forEach((t) => clearTimeout(t));
    setAutoTimers([]);
    
    setMessages([]);
    setPhase("idle");
    setShowOptions(false);
    
    setTimeout(() => {
      setAutoFlowStarted(false);
      startInitialAutoFlow();
    }, 200);
  };

  
  const handleEditMessage = async (messageId, newMessage) => {
    try {
      const res = await axios.put(
        `/api/chat/edit/${messageId}`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => prev.map((m) => (m._id === messageId ? res.data.data : m)));
      setEditingMessage(null);
      setEditText("");
      setMenuOpen(null);
    } catch (err) {
      console.error("Error editing message:", err);
    }
  };

  const startEditing = (message) => {
    setEditingMessage(message._id);
    setEditText(message.message);
    setMenuOpen(null);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const toggleMenu = (messageId) => {
    setMenuOpen(menuOpen === messageId ? null : messageId);
  };

  // cleanup timers when component unmounts
  useEffect(() => {
    return () => {
      autoTimers.forEach((t) => clearTimeout(t));
    };
  }, [autoTimers]);


// const LiveChat = ({ isOpen, onClose, userId, token }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [editText, setEditText] = useState("");
//   const [menuOpen, setMenuOpen] = useState(null);

//   // Fetch chat history when modal opens
//   useEffect(() => {
//     if (isOpen && userId) {
//       fetchMessages();
//     }
//   }, [isOpen, userId]);

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/chat/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setMessages(res.data.data);
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send new message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     try {
//       const res = await axios.post(
//         "/api/chat/send",
//         {
//           message: input,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessages((prev) => [...prev, res.data.data]);
//       setInput("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   // Edit message
//   const handleEditMessage = async (messageId, newMessage) => {
//     try {
//       const res = await axios.put(
//         `/api/chat/edit/${messageId}`,
//         { message: newMessage },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg._id === messageId ? res.data.data : msg
//         )
//       );
//       setEditingMessage(null);
//       setEditText("");
//       setMenuOpen(null);
//     } catch (err) {
//       console.error("Error editing message:", err);
//     }
//   };

//   // Start editing a message
//   const startEditing = (message) => {
//     setEditingMessage(message._id);
//     setEditText(message.message);
//     setMenuOpen(null);
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingMessage(null);
//     setEditText("");
//   };

//   // Toggle menu for a message
//   const toggleMenu = (messageId) => {
//     setMenuOpen(menuOpen === messageId ? null : messageId);
//   };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/40 px-4 sm:px-8 
          flex items-center justify-center 
          md:items-start md:justify-end md:pt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full max-w-md h-full max-h-[80vh] 
            bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                {/* <img
                  src="https://randomuser.me/api/portraits/women/79.jpg"
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                /> */}
                <img src={avatarSrc} alt="user" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-gray-900 font-semibold text-sm">{username}</h4>
                  <p className="text-gray-500 text-xs">Online</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md text-sm px-4 py-2 rounded-2xl shadow relative group ${
                        msg.sender === "user"
                          ? "bg-green-400 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {editingMessage === msg._id ? (
                        <div className="flex flex-col">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-white text-black px-2 py-1 rounded mb-2"
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditMessage(msg._id, editText)}
                              className="text-xs bg-[#DD9210] text-white px-2 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start">
                            <p>{msg.message}</p>
                            {msg.sender === "user" && (
                              <button
                                onClick={() => toggleMenu(msg._id)}
                                className="ml-2 opacity-70 hover:opacity-100"
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            )}
                          </div>
                          <span className="block text-xs text-gray-600 mt-1 text-right">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {msg.isEdited && " (edited)"}
                          </span>
                          
                          {menuOpen === msg._id && (
                            <div className="absolute right-0 top-6 bg-[#bef264] shadow-md rounded-md p-1 z-10">
                              <button
                                onClick={() => startEditing(msg)}
                                className="flex items-center w-full px-2 py-1 text-xs hover:bg-[#a5d64c] rounded"
                              >
                                <Edit3 size={12} className="mr-1" />
                                Edit
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Guided Options */}
              {/* {autoStage >= 3 && (
                <div className="flex flex-col gap-2">
                  {topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(topic)}
                      className="w-full text-left text-sm bg-white border border-green-400 hover:bg-[#bef264] hover:text-white transition px-3 py-2 rounded-lg shadow-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}

            </div> */}

            {showOptions && phase === "optionsShown" && (
                <div className="flex flex-col gap-2 mt-2">
                  {firstStageTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(topic)}
                      className="w-full text-left text-sm bg-white border border-green-400 hover:bg-[#bef264] hover:text-white transition px-3 py-2 rounded-lg shadow-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            

            

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-full"
                >
                  ➤
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  const { loading, error, products = [] } = useSelector(
    (state) => state.product
  );
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toast, setToast] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const categories = ["All", "SHOES", "WATCH", "LOWERS", "TSHIRT"];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToast({ message: error.message || error, type: "error" });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Disable body scroll when chat is open
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isChatOpen]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );

  const handleCheckNow = (category) => {
    navigate(`/products?category=${category.toLowerCase()}`);
    setShowPopup(false);
  };

  const handleChatOpen = () => {
    if (!isAuthenticated) {
      setToast({ message: "Please login to use chat", type: "error" });
      navigate("/login");
      return;
    }
    setIsChatOpen(true);
  };

  return (
    <>
      <Navbar />
      <ImageSlider />
      <CategoryGrid />

      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50  px-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-lg w-[95%] sm:w-full max-w-md md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <motion.button
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-4 text-gray-500 hover:text-black text-3xl font-extrabold"
                onClick={() => setShowPopup(false)}
              >
                ×
              </motion.button>

              <h2 className="text-center text-gray-500 font-semibold text-sm sm:text-base">
                WAIT! CHECK OUT THESE
              </h2>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
                ITEMS RECOMMENDED FOR{" "}
                <span className="text-red-500">YOU!</span>
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <img
                    src={shoes}
                    alt="Shoes"
                    className="w-28 h-24 sm:w-32 sm:h-28 object-contain"
                  />
                  <p className="mt-2 font-semibold text-xs sm:text-sm">
                    Run With Style
                  </p>
                  <button
                    onClick={() => handleCheckNow("shoes")}
                    className="group mt-2 bg-[#bef264] hover:bg-[#a5d64c] text-white px-3 py-1 text-xs sm:text-sm rounded flex items-center gap-1"
                  >
                    Check it Now
                    <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110">
                      →
                    </span>
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={lower}
                    alt="Lower"
                    className="w-28 h-24 sm:w-32 sm:h-28 object-contain"
                  />
                  <p className="mt-2 font-semibold text-xs sm:text-sm">
                    Comfort Meets Style
                  </p>
                  <button
                    onClick={() => handleCheckNow("lower")}
                    className="group mt-2 bg-[#bef264] hover:bg-[#a5d64c] text-white px-3 py-1 text-xs sm:text-sm rounded flex items-center gap-1"
                  >
                    Check it Now
                    <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110">
                      →
                    </span>
                  </button>
                </div>

                <div className="flex flex-col items-center col-span-2 md:col-span-1 justify-center">
                  <img
                    src={tshirt}
                    alt="Tshirt"
                    className="w-28 h-24 sm:w-32 sm:h-28 object-contain"
                  />
                  <p className="mt-2 font-semibold text-xs sm:text-sm">
                    Style Made Easy
                  </p>
                  <button
                    onClick={() => handleCheckNow("tshirt")}
                    className="group mt-2 bg-[#bef264] hover:bg-[#a5d64c] text-white px-3 py-1 text-xs sm:text-sm rounded flex items-center gap-1"
                  >
                    Check it Now
                    <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Products Section */}
      <section className="px-6 md:px-12 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6"
            data-aos="fade-up"
          >
            Trending Now
          </h2>

          <div
            className="flex flex-wrap justify-center gap-3 mb-10"
            data-aos="zoom-in"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${selectedCategory === cat
                  ? "bg-[#bef264] text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Product key={index} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}
        </div>
      </section>

      <BrandSlider />
      <Offer />
      <Testireview />
      <Subscribe />
      <Footer />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Live Chat Component */}
      <LiveChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        userId={user?._id}
        token={user?.token}
      />

      {/* Fixed Chat Icon */}
      <div className="fixed bottom-6 right-6 z-[9998] group">
        <div className="absolute right-20 bottom-2 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-[#000000] text-white text-xs sm:text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap ">
          Connect me, you need help !
          <div className="absolute right-[-8px] bottom-2 w-0 h-0 border-t-6 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-[#000000]"></div>
        </div>
       
        <motion.button
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-full shadow-lg bg-[#bef264] hover:bg-[#a5d64c] text-white fixed bottom-8 right-8 z-50"
          onClick={handleChatOpen}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </>
  );
};

export default Home;