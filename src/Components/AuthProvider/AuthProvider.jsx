// come form source: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem("isLoggedIn") ? false : JSON.parse(localStorage.getItem("isLoggedIn")));
  const [user_id, setUserId] = useState(!localStorage.getItem("user_id") ? null : JSON.parse(JSON.stringify(localStorage.getItem("user_id"))));
  const navigate = useNavigate();

  const logIn = (user_id) => {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user_id", user_id);
      setIsLoggedIn(true)
      setUserId(user_id)
  };

  const logOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false)
    setUserId(null)
    navigate("/sign_in");
  };

  return (
    <AuthContext.Provider value={{ user_id, isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};