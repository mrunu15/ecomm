import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleUser,
  removeErrors,
  removeSuccess,
  updateUserRole,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";

function UpdateRole() {
  const { userId } = useParams();
  const { user, success, loading, error } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, [dispatch, userId]);

  const { name, email, role } = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ userId, role }));
  };

  useEffect(() => {
    if (success) {
      toast.success("User Role Updated Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/admin/users");
    }
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update User Role" />

      <div className="flex items-center justify-center min-h-[90vh] mt-10 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Update User Role
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                readOnly
                value={name}
                 className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
               focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                readOnly
                value={email}
                className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
               focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                required
                 className="peer w-full bg-gray-100 text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
               focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#bef264] text-gray-900 hover:text-white font-medium rounded-lg hover:bg-[#a5d64c] focus:ring-2 focus:ring-[#a5d64c] transition"
            >
              Update Role
            </button>
          </form>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default UpdateRole;
