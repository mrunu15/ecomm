import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
// import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteUser,
  fetchUsers,
  removeErrors,
} from "../feature/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function UsersList() {
  const { users, loading, error, message } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (confirm) {
      dispatch(deleteUser(userId));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (message) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(clearMessage());
      navigate("/admin/dashboard");
    }
  }, [dispatch, error, message, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Users" />

          <div className="py-8 mt-28 min-h-[70vh] px-0 sm:px-8 lg:px-16"
            style={{
              overflow: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}

          >
            <style>
              {`
                div::-webkit-scrollbar {
                display: none;
              }`}
            </style>
            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-hidden">
              <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4">
                All Users
              </h1>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#e6f9d8] via-[#c9efb5] to-[#a5d64c] text-gray-900 text-left">
                      <th className="p-3">Sl No</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Created At</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-medium text-gray-700">
                          {user.name}
                        </td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <Link
                            to={`/admin/user/${user._id}`}
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                          >
                            <Edit fontSize="small" />
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                          >
                            <Delete fontSize="small" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* <Footer /> */}
        </>
      )}
    </>
  );
}

export default UsersList;
