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

        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-[#bef264] rounded-lg shadow hover:bg-[#a5d64c] transition"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default NoProducts;
