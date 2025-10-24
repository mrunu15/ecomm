import React from "react";

function NoProducts({ keyword }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
        <div className="text-5xl mb-4 text-[#5ac8fa]">⚠️</div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No Products Found
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {keyword ? (
            <>
              We couldn’t find any products matching{" "}
              <span className="font-semibold text-gray-800">"{keyword}"</span>.
              <br />
              Try using different keywords or browse our complete catalog.
            </>
          ) : (
            "No products are available right now. Please check back later."
          )}
        </p>
      </div>
    </div>
  );
}

export default NoProducts;
