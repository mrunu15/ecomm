import React, { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyOrders, removeErrors } from '../feature/order/orderSlice';
import Loader from '../components/Loader';

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
      ${type === "success" ? "bg-[#bef264] hover:bg-[#a5d64c]" : type === "error" ? "bg-red-500 hover:bg-red-600" : "bg-blue-400 hover:bg-blue-500"}`}
        >
            <div className="flex items-center space-x-2">
                <span className="text-2xl">
                    <i className={`bx ${type === "success" ? "bx-check" : type === "error" ? "bx-x" : "bx-info-circle"}`} />
                </span>
                <p className="font-bold">{message}</p>
            </div>
        </div>
    );
};

function MyOrders() {
    const { orders = [], loading, error } = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const [toast, setToast] = useState(null);

    useEffect(() => {
        dispatch(getAllMyOrders());
        if (error) {
            setToast({ message: error, type: "error" });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    // Filter out orders with empty orderItems
    const filteredOrders = orders.filter(
        (order) => order.orderItems && order.orderItems.length > 0
    );

    return (
        <>
            <PageTitle title="User Orders" />

            {loading ? (
                <div className="mt-32">
                    <Loader />
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="max-w-7xl mx-auto mt-20 p-6 bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] dark:bg-gray-800 shadow-lg rounded-2xl min-h-[50vh]">
                    <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                        My Orders
                    </h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left">
                            <thead className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 lg:text-md font-semibold text-gray-700 dark:text-gray-300">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-3 lg:text-md font-semibold text-gray-700 dark:text-gray-300 text-center">
                                        Items Count
                                    </th>
                                    <th className="px-4 py-3 lg:text-md font-semibold text-gray-700 dark:text-gray-300 text-center">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 lg:text-md font-semibold text-gray-700 dark:text-gray-300 text-center">
                                        Total Price
                                    </th>
                                    <th className="px-4 py-3 lg:text-md font-semibold text-gray-700 dark:text-gray-300 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className=" transition"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium">
                                            {order._id}
                                        </td>
                                        <td className="px-4 py-3 text-md font-medium text-gray-700 dark:text-gray-300 text-center">
                                            {order.orderItems.length}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-4 py-2 text-sm font-bold text-center ${order.orderStatus === 'Delivered'
                                                        ? 'text-green-600 rounded-xl bg-yellow-200'
                                                        : order.orderStatus === 'Processing'
                                                            ? 'text-yellow-800 bg-red-200'
                                                            : 'text-red-500 bg-red-200'
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-md font-medium text-gray-900 dark:text-gray-300 text-center">
                                            ₹{order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-2">
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="font-medium bg-[#F49210] cursor-pointer text-white px-3 py-1 rounded hover:bg-[#DD7106] flex items-center transition"
                                            >
                                                <Eye className="w-4 h-4 mr-1" /> View
                                            </Link>

                                            {order.orderStatus === "Delivered" && (
                                                <button
                                                    className="px-3 py-1 text-sm rounded-md bg-[#F49210] hover:bg-[#DD7106] text-gray-800 font-medium shadow-sm transition"
                                                    onClick={() =>
                                                        setToast({
                                                            message: `Return request started for Order ${order._id}`,
                                                            type: "info",
                                                        })
                                                    }
                                                >
                                                    Return Request
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center min-h-[60vh] mt-32 text-gray-500">
                    <p className="text-2xl md:text-4xl font-semibold mb-4">
                        No Orders Found
                    </p>
                    <Link
                        to="/products"
                        className="px-6 py-2 bg-[#bef264] text-white font-semibold rounded-lg hover:bg-[#a5d64c] transition"
                    >
                        Browse Products
                    </Link>
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </>
    );
}

export default MyOrders;
