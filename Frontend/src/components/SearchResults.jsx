import React from "react";
import { FaExternalLinkAlt, FaRupeeSign } from "react-icons/fa";

export default function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          No results found
        </h2>
        <p className="text-gray-600">
          Try adjusting your search terms or browse our categories.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 p-3"
          >
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-80 object-contain"
              />
              {/* <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">
                New
              </div> */}
            </div>
            <div className="p-4 obj flex-grow flex flex-col">
              <h3
                data-tooltip-target="tooltip-top"
                className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2"
              >
                {product.title}
              </h3>
              <div
                id="tooltip-top"
                role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                {product.title}
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>

              <div className="mt-auto">
                <p className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {product.price}
                </p>
                <div className="flex justify-between items-center">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Product
                  </a>
                  <a
                    href={product.nextUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-1">Reviews</span>
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
