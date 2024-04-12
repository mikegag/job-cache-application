import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const isLoggedIn = localStorage.getItem("user_id");
  return isLoggedIn !== null;

};

export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}


