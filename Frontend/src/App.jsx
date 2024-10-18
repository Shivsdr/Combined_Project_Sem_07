import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Main from "./components/main";
import { useNavigate } from "react-router-dom";

function App() {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:3000/isAuth", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuth);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleSearch = (query) => {
    if (isAuthenticated) {
      setSearchedTerm(query);
      console.log("searchTerm = ", query);
    } else {
      navigate("/login");
    }
  };

  const handleDataFromNav = async () => {
    try {
      const response = await axios.post("http://localhost:3000/logout", {
        withCredentials: true,
      });

      console.log("Logout response:", response);
      setIsAuthenticated(false);
      // window.location.reload();
      localStorage.removeItem("connect.sid");
      // navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDataFromLogin = (isAuthenticated) => {
    setIsAuthenticated(isAuthenticated);
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      <Navbar
        onSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        sendDataToApp={handleDataFromNav}
      />
      <main className="container mx-auto px-4 py-8">
        <Main searchQuery={searchedTerm} isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
}

export default App;
