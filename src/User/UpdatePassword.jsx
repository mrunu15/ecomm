import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, removeSuccess, updatePassword } from '../feature/user/userSlice';
import Loader from '../components/Loader';

// Custom Toast Component
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

function UpdatePassword() {
  const { success, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('oldPassword', oldPassword);
    myForm.set('newPassword', newPassword);
    myForm.set('confirmPassword', confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      setToast({ message: 'Password Updated successfully', type: 'success' });
      dispatch(removeSuccess());
      setTimeout(() => navigate('/profile'), 1500); // Navigate after toast shows
    }
  }, [dispatch, success, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Password Update" />
          <div className="flex justify-center items-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-center text-[#bef264] mb-6">
                Update Password
              </h2>

              <form onSubmit={updatePasswordSubmit} className="space-y-6">
                <div className="w-full relative">
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                     focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="oldPassword"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                     peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                     peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                     peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                  >
                    Old Password
                  </label>
                </div>

                <div className="w-full relative">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                     focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="newPassword"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                     peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                     peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                     peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                  >
                    New Password
                  </label>
                </div>

                <div className="w-full relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" "
                    required
                    className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
                     focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
                     peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
                     peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
                     peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                  >
                    Confirm Password
                  </label>
                </div>

                <div className='flex justify-center'>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#bef264] text-white hover:text-gray-900 py-2 font-medium text-lg shadow-md hover:bg-[#a5d64c] transition-all duration-300"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

export default UpdatePassword;
