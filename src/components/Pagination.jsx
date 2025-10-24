import React from "react";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) {
  const { totalPages, products } = useSelector((state) => state.product);
  if (!products || products.length === 0 || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-12 px-2">
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-[#5ac8fa]  hover:text-white transition shadow-sm"
          >
            {firstPageText}
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-[#5ac8fa]  hover:text-white transition shadow-sm"
          >
            {prevPageText}
          </button>
        </>
      )}

      {/* Display Numbers */}
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold border rounded-lg transition shadow-sm ${
            currentPage === number
              ? "bg-[#5ac8fa] text-white border-[#5ac8fa] cursor-default"
              : "bg-white text-gray-700 border-gray-300 hover:bg-[#71cffb] hover:text-white"
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next and Last Buttons */}
      {currentPage < totalPages && (
        <>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-[#5ac8fa] hover:text-white transition shadow-sm"
          >
            {nextPageText}
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-[#5ac8fa]  hover:text-white transition shadow-sm"
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
}

export default Pagination;
