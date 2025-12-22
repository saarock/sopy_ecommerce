import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
// import { Auth } from "../services";
import { login, setError, setLoading } from "../features/auth/authSlice";
// import { ACCESS_TOKEN_COOKIE_NAME } from "../constant";
import LoadingComponent from "./loading/LoadingComponent";
// import LocalStorage from "../utils/localStorage";
// import { handleResponse } from "../utils";
// import Cookie from "../utils/cookie";

const PUBLIC_ROUTES = ["/", "/login", "/register"]; // Define all public routes
const FREE_ROUTE = ["/login", "/register"]; // Define all public routes

const ProtectedPage = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  //   const location = useLocation();
  //   const navigate = useNavigate();

  // Loading and Error states from auth slice
  const { loading, error } = auth;

  /**
   * run every time when the page mount;
   */

  //   const isPublicPage = PUBLIC_ROUTES.includes(location.pathname);
  //   const isFree = FREE_ROUTE.includes(location.pathname);

  useEffect(() => {
    // MOCK AUTH: Always log in as Admin
    dispatch(setLoading(true));
    dispatch(login({
      token: "mock-token",
      role: "admin",
      _id: "mock-admin-id",
      name: "Admin User",
      email: "admin@example.com"
    }));
    dispatch(setLoading(false));
  }, [dispatch]);

  // Redirect logic removed as we want to allow access everywhere

  if (loading) {
    return <LoadingComponent />; // Show loading indicator
  }

  // if (error && !isPublicPage) {
  //   return <div>Error: {error}</div>; // Display error message if error exists
  // }

  return <>{children}</>; // Render children when everything is fine
};

export default ProtectedPage;
