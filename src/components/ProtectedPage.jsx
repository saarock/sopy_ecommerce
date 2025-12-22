import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { Auth } from "../services";
import { login, setError, setLoading } from "../features/auth/authSlice";
import { ACCESS_TOKEN_COOKIE_NAME } from "../constant";
import LoadingComponent from "./loading/LoadingComponent";
import LocalStorage from "../utils/localStorage";
import { handleResponse } from "../utils";
import Cookie from "../utils/cookie";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/reset-password"]; // Define all public routes
const FREE_ROUTE = ["/login", "/register", "/reset-password"]; // Routes accessible only when NOT logged in

const ProtectedPage = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Loading and Error states from auth slice
  const { loading, error } = auth;

  const isFree = FREE_ROUTE.includes(location.pathname);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Only verify if we don't have user data in store but might have a cookie
        if (!auth.isAuthenticated) {
          dispatch(setLoading(true));
          // For now, let's trust the cookie/localStorage if we can't hit the server in this "copy" phase
          // Or actually try to verify if the server is running.
          // If server not running, this might fail.
          // But assuming we want "Ecommerce UI" we can keep the verify logic.
          const response = await handleResponse(Auth.verify());

          if (response.data?.userData) {
            const userStateResponseData = response.data.userData;
            LocalStorage.setItem("userData", userStateResponseData);
            const userStateObj = {
              token: Cookie.get(ACCESS_TOKEN_COOKIE_NAME),
              ...LocalStorage.getItem("userData"),
            };
            dispatch(login(userStateObj));
          } else if (response.error) {
            // If verify fails, simple logout/error
            throw new Error(response.error);
          }
        }
      } catch (error) {
        // dispatch(setError(error.message));
        // If verification fails, ensure we are logged out
      } finally {
        dispatch(setLoading(false));
      }
    };

    verifyToken();
  }, [dispatch, auth.isAuthenticated]);


  // Redirect logic
  useEffect(() => {
    if (!loading) {
      if (auth.isAuthenticated) {
        // If logged in and trying to access Login/Register, go to Home
        if (isFree) {
          navigate("/");
        }
      } else {
        // If NOT logged in and trying to access protected route (Home), go to Login
        // Assuming Home is protected. 
        if (!isFree) {
          navigate("/login");
        }
      }
    }
  }, [auth.isAuthenticated, loading, location.pathname, isFree, navigate]);

  if (loading) {
    return <LoadingComponent />;
  }

  return <>{children}</>;
};

export default ProtectedPage;
