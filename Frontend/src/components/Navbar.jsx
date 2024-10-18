import React, { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onSearch, isAuthenticated, sendDataToApp }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchQuery("");
  };

  const handleClick = async (route) => {
    if (route === "/logout") {
      setIsLoading(true);
      await sendDataToApp(false);
      setIsLoading(false);
    } else {
      navigate(route);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div
          onClick={() => handleClick("/home")}
          className="flex items-center mb-4 md:mb-0 cursor-pointer"
        >
          <img
            src={logo}
            alt="Ecommerce Insights Logo"
            className="h-8 w-auto mr-2"
          />
          <span className="text-xl font-bold">Ecommerce Insights</span>
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              aria-label="Search products"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600"
            >
              <FaSearch />
            </button>
          </form>

          {isAuthenticated ? (
            <button
              onClick={() => handleClick("/logout")}
              disabled={isLoading}
              className={`hover:text-blue-200 transition-colors duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaUser className="inline mr-2" />
              {isLoading ? "Logging Out..." : "Log Out"}
            </button>
          ) : (
            <button
              onClick={() => handleClick("/login")}
              className="hover:text-blue-200 transition-colors duration-300"
            >
              <FaUser className="inline mr-2" />
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
