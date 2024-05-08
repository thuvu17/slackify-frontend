import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user.user_id) return <Navigate to="/sign_in" />;
  return <Outlet />;
};

export default PrivateRoute;