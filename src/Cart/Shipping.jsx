import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveShippingInfo } from "../feature/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 py-2
        pt-4 pb-2 flex justify-between items-center focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
      >
        <span className={value ? "capitalize" : "text-gray-400"}>{value || placeholder}</span>
        <div className="flex flex-col ml-2">
          <svg
            className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 12l3-3 3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${
              open ? "-rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-[#bef264] rounded-md shadow-lg max-h-56 overflow-auto">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`cursor-pointer px-3 py-1 ${
                value === opt ? "bg-[#a5d64c] text-white font-semibold" : "hover:bg-[#bef264] hover:text-gray-900"
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function Shipping() {
  const { shippingInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [city, setCity] = useState(shippingInfo.city || "");

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      toast.error("Invalid Phone number! It should be 10 digits", { position: "top-center", autoClose: 3000 });
      return;
    }
    dispatch(saveShippingInfo({ address, pinCode, phoneNumber, country, state, city }));
    toast.success("✅ Shipping info saved successfully!", { position: "top-center", autoClose: 2000 });
    navigate("/order/confirm");
  };

  //dropdown options
  const countryOptions = Country.getAllCountries().map(c => c.name);
  const stateOptions = country ? State.getStatesOfCountry(country).map(s => s.name) : [];
  const cityOptions = country && state ? City.getCitiesOfState(country, state).map(c => c.name) : [];

  return (
    <>
      <PageTitle title="Shipping Info" />
      <Navbar />
      <CheckoutPath activePath={0} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-800 text-center mb-10">Shipping Details</h1>

        <form className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-2xl p-6 md:p-10" onSubmit={shippingInfoSubmit}>
          <div className="flex flex-col gap-6 relative">
            <div className="relative">
              <input
                type="text"
                placeholder=" "
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                required
              />
              <label className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-focus:-top-2 peer-focus:text-xs">Address</label>
            </div>

            <div className="relative">
              <input
                type="number"
                id="pinCode"
                placeholder=" "
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                required
              />
              <label htmlFor="pinCode" className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-focus:-top-2 peer-focus:text-xs">Pin Code</label>
            </div>

            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                placeholder=" "
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                required
              />
              <label htmlFor="phoneNumber" className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-focus:-top-2 peer-focus:text-xs">Phone Number</label>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <CustomDropdown
              options={countryOptions}
              value={Country.getAllCountries().find(c => c.isoCode === country)?.name || ""}
              onChange={(name) => {
                const selected = Country.getAllCountries().find(c => c.name === name);
                setCountry(selected.isoCode);
                setState("");
                setCity("");
              }}
              placeholder="Select Country"
            />

            {country && (
              <CustomDropdown
                options={stateOptions}
                value={State.getStatesOfCountry(country).find(s => s.isoCode === state)?.name || ""}
                onChange={(name) => {
                  const selected = State.getStatesOfCountry(country).find(s => s.name === name);
                  setState(selected.isoCode);
                  setCity("");
                }}
                placeholder="Select State"
              />
            )}

            {state && (
              <CustomDropdown
                options={cityOptions}
                value={city}
                onChange={setCity}
                placeholder="Select City"
              />
            )}
          </div>

          <button type="submit" className="md:col-span-2 mt-6 bg-[#bef264] hover:bg-[#a5d64c] hover:text-gray-800 text-white font-semibold rounded-lg py-3 text-lg transition">
            Continue
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable theme="colored" />

      <Footer />
    </>
  );
}

export default Shipping;
