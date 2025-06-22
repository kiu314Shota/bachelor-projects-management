import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId);
      } catch (e) {
        console.error("Invalid token", e);
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }
  }, [token]);

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setToken(null);
    setCurrentUserId(null);
    localStorage.removeItem("token");
  };

  return (
      <AuthContext.Provider value={{ token, login, logout, currentUserId }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
