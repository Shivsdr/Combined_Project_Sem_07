import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PastSearches() {
  const [pastSearches, setPastSearches] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("http://localhost:3000/pastSearches", {
        withCredentials: true,
      });

      const data_from_api = response.data.result;

      // console.log("data_from_api:", data_from_api);

      let data_to_display = [];

      data_from_api.map((data) => {
        let temp = {
          id: data.id,
          query: data.searchedTerm,
          date: data.date,
        };

        data_to_display.push(temp);
      });

      // const mockPastSearches = [
      //   { id: 1, query: "Laptop", date: "2023-05-10" },
      //   { id: 2, query: "Smartphone", date: "2023-05-09" },
      //   { id: 3, query: "Headphones", date: "2023-05-08" },
      // ];

      setPastSearches(data_to_display);
    };

    getData();
  }, []);

  if (pastSearches.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to Ecommerce Insights!
        </h2>
        <p className="text-gray-600">
          You haven't searched for any products yet. Use the search bar above to
          get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Your Past Searches
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pastSearches.map((search) => (
          <div
            key={search.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              {search.query}
            </h3>
            <p className="text-gray-600">Searched on: {search.date}</p>
            <button className="mt-4 text-blue-500 hover:text-blue-700 transition-colors duration-300">
              View Results
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
