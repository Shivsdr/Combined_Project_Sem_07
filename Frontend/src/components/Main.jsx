import React, { useState, useEffect } from "react";
import Loading from "./Loading.jsx";
import PastSearches from "./PastSearches.jsx";
import SearchResults from "./SearchResults.jsx";
import axios from "axios";

const Main = ({ searchQuery }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date().toISOString().split("T")[0];
      if (searchQuery) {
        setIsLoading(true);
        try {
          const result = await axios.post(
            "http://localhost:3000/search",
            {
              searchQuery,
              date,
            },
            {
              withCredentials: true,
            }
          );

          let data = JSON.parse(result.data.result);
          console.log(data);
          setSearchResult(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [searchQuery]); // Run effect when searchQuery changes

  if (isLoading) {
    return <Loading />;
  }

  if (searchResults.length !== 0) {
    return <SearchResults results={searchResults} />;
  }

  return <PastSearches />;
};

export default Main;
