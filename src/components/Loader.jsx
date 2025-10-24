import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="
          w-20 h-20
          border-[10px] border-white/30
          border-t-4 border-t-[#bef264]
          rounded-full
          animate-spin
        "
      ></div>
    </div>
  );
}

export default Loader;
