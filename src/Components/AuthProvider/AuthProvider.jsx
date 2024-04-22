// come form source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import React, { useContext, createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') || false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const logIn = (userId) => {
      setIsLoggedIn(true);
      setUserId(userId);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userId", userId);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUserId(null)
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};