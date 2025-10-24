import React from "react";
import { AccountBalance, LibraryAddCheck, LocalShipping } from "@mui/icons-material";

function CheckoutPath({ activePath }) {
  const path = [
    {
      label: "Shipping Details",
      icon: <LocalShipping fontSize="small" />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheck fontSize="small" />,
    },
    {
      label: "Payment",
      icon: <AccountBalance fontSize="small" />,
    },
  ];

  return (
    <div className="flex justify-center items-center gap-6 sm:gap-12 md:gap-16 px-4 sm:px-8 md:px-16 py-8 border-b border-gray-200 mt-20">
      {path.map((item, index) => {
        const isActive = activePath === index;
        const isCompleted = activePath >= index;

        return (
          <div
            key={index}
            className="relative flex flex-col items-center text-center flex-1"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full 
              ${isCompleted ? "bg-green-100 text-green-600" : isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}
              shadow-md transition-all duration-300`}
            >
              {item.icon}
            </div>

            <p
              className={`mt-2 text-sm sm:text-base font-medium 
              ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"}`}
            >
              {item.label}
            </p>

            {index !== path.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 w-full h-[2px] 
                ${isCompleted ? "bg-green-500" : "bg-gray-300"} 
                -z-10`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutPath;
