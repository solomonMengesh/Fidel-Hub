import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state to handle errors globally

  // Fetch user from backend when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user...");

        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        console.log("User data received:", res.data);
        setUser(res.data); // Set user data when fetched successfully
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);

        setUser(null); // Ensure user is null if fetching fails
        setError("Failed to fetch user. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }  // Ensure cookies are sent with request
      );
      setUser(res.data.user); // Assuming your API returns user data under 'user'
      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);
