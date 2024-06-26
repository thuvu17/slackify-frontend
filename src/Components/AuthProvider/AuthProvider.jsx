// reference: https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!localStorage.getItem("isLoggedIn") ? false : JSON.parse(localStorage.getItem("isLoggedIn")));
  const [user_id, setUserId] = useState(!localStorage.getItem("user_id") ? null : JSON.parse(JSON.stringify(localStorage.getItem("user_id"))));
  const [isAdmin, setAdmin] = useState(!localStorage.getItem("isAdmin") ? false : JSON.parse(localStorage.getItem("isAdmin")));
  const navigate = useNavigate();

  const logIn = (user_id) => {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("user_id", user_id);
      setIsLoggedIn(true)
      setUserId(user_id)
      if (user_id === '661948925f8f92515d0e9d47') {
        localStorage.setItem('isAdmin', true);
        setAdmin(true);
      }
      else {
        localStorage.setItem('isAdmin', false);
        setAdmin(false);
      }
  };

  const logOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false)
    setAdmin(false)
    setUserId(null)
    navigate("/sign_in");
  };

  return (
    <AuthContext.Provider value={{ user_id, isLoggedIn, logIn, logOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};