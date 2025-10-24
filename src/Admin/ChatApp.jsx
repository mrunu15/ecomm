import { useState, useEffect } from "react";
import { Send, Menu, Plus, Trash2, Edit } from "lucide-react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";

const SCROLLBAR_HIDDEN_CLASSES =
    "scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

export default function ChatApp() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);

    useEffect(() => {
        fetch("/api/v1/admin/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => res.json())
            .then((data) => {
                
                const userContacts = data.users.filter(user => user.role === "user");
                setContacts(userContacts);
                if (userContacts.length > 0) setSelectedContact(userContacts[0]);
            });
    }, []);

    useEffect(() => {
        if (!selectedContact) return;
        fetch(`/api/chat/${selectedContact._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then((res) => res.json())
            .then((data) => setMessages(data.data));
    }, [selectedContact]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        if (editingMessage) {
            const res = await fetch(`/api/chat/edit/${editingMessage._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages(messages.map((m) => (m._id === editingMessage._id ? data.data : m)));
            setEditingMessage(null);
        } else {
            const res = await fetch(`/api/chat/admin/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ userId: selectedContact._id, message: input }),
            });
            const data = await res.json();
            setMessages([...messages, data.data]);
        }

        setInput("");
    };

    const handleDeleteMessage = async (id) => {
        await fetch(`/api/chat/delete/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessages(messages.filter((m) => m._id !== id));
    };

    return (
        <>
            <Navbar />
            <PageTitle title="Live Chat" />
            {/* <div className="flex h-screen w-full bg-gray-50 overflow-hidden"> */}

            <div className="flex flex-col md:flex-row h-[84vh] w-full bg-gray-50 rounded-xl overflow-hidden md:overflow-visible">

                {/* Sidebar */}
                <div
                    className={`fixed md:static top-0 left-0 h-full w-3/4 md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col z-20 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                >
                    <div className="p-4 flex justify-between items-center border-b bg-orange-500 text-white font-semibold">
                        <span>Chats</span>
                        <button className="md:hidden " onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    <div className="p-3">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring focus:ring-orange-300"
                        />
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {contacts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No users found</p>
                            </div>
                        ) : (
                            contacts.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => {
                                        setSelectedContact(c);
                                        setSidebarOpen(false);
                                    }}
                                    className={`flex items-center gap-3 p-3 cursor-pointer transition ${selectedContact?._id === c._id
                                        ? "bg-orange-500 text-white"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src={c.avatar?.url || "https://i.pravatar.cc/40"}
                                        alt={c.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-sm truncate">{c.name} {c.lastName}</p>
                                        </div>
                                        <p className=" sm:text-xs  text-gray-500 mt-1">
                                            {c.email}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-between mt-1 text-[11px] sm:text-xs">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                                {c.role}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    {selectedContact ? (
                        <>
                            <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="md:hidden text-gray-600"
                                        onClick={() => setSidebarOpen(true)}
                                    >
                                        <Menu size={22} />
                                    </button>
                                    <img
                                        src={selectedContact.avatar?.url || "https://i.pravatar.cc/40"}
                                        alt={selectedContact.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                                    />
                                    <div>
                                        <p className="font-semibold text-lg">{selectedContact.name} {selectedContact.lastName}</p>
                                         <div className="flex items-center gap-2">
                                            {/*<p className="text-xs text-green-500">Online</p>
                                            <span className="text-xs text-gray-500">•</span>
                                            <p className="text-xs text-gray-500">{selectedContact.email}</p>
                                            <span className="text-xs text-gray-500">•</span> */}
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                                {selectedContact.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="text-right">
                                    <p className="text-xs text-gray-500">Member since</p>
                                    <p className="text-sm font-medium">
                                        {new Date(selectedContact.createdAt).toLocaleDateString()}
                                    </p>
                                </div> */}
                            </div>

                            {/* Messages */}
                            <div className={`flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100 ${SCROLLBAR_HIDDEN_CLASSES}`}>
                                {messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-md ${msg.sender === "admin"
                                                ? "bg-orange-500 text-white rounded-br-none"
                                                : "bg-white text-gray-800 rounded-bl-none"
                                                }`}
                                        >
                                            {msg.message}
                                            <div className="text-[10px] text-gray-600 mt-1 text-right flex justify-between items-center">
                                                <span>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                {msg.sender === "admin" && (
                                                    <div className="flex gap-2 ml-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingMessage(msg);
                                                                setInput(msg.message);
                                                            }}
                                                        >
                                                            <Edit size={14} className="text-white" />
                                                        </button>
                                                        <button onClick={() => handleDeleteMessage(msg._id)}>
                                                            <Trash2 size={14} className="text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Box */}

                            <div className="p-2 sm:p-3 border-t flex items-center gap-2 bg-white w-full shrink-0">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 min-w-0 border rounded-full px-3 py-2 outline-none text-sm bg-gray-100 focus:ring focus:ring-orange-300"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="flex-shrink-0 bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 transition-all"
                                >
                                    <Send size={18} className="block" />
                                </button>
                            </div>

                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-100">
                            <div className="text-center text-gray-500">
                                <p className="text-lg">No user selected</p>
                                <p className="text-sm">Select a user to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* <button
                    className="md:hidden fixed bottom-16 right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-10"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Plus size={20} />
                </button> */}
                <button
                    className="md:hidden fixed bottom-20 right-4 sm:bottom-16 sm:right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all z-50"
                    style={{
                        insetInlineEnd: "0.4rem",
                        bottom: "6rem",
                    }}
                    onClick={() => setSidebarOpen(true)}
                >
                    <Plus size={20} className="stroke-[2]" />
                </button>
            </div>
        </>
    );
}