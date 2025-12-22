import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./App.css";
import Layout from "./Layout";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedPage from "./components/ProtectedPage";
// import AddProduct from "./components/adminDashComponents/AddProduct";
// import AdminDashboardLayout from "./AdminDashboardLayout";
// import ProductManagePage from "./pages/admin/ProductManagePage";
// import { Profile } from "./components";
// import UserDashboardLayout from "./UserDashboardLayout";
// import Products from "./pages/products/Products";
// import ManageBookedProduct from "./pages/manageBookedProduct/ManageBookedProduct";
// import ManageUser from "./pages/admin/ManageUser copy";
import ResetPassword from "./pages/login/ResetPassword";
// import MyProduct from "./pages/myProduct/MyProduct";
// import Stats from "./pages/stats/Stats";
// import Notifications from "./pages/notifications/Notifications";
// import AdminNotifications from "./pages/admin/AdminNotifications";
// import AdminDashboard from "./pages/admin/AdminDashboard";
import SupportPage from "./pages/support/SupportPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Layout />}>

            <Route
              path="/"
              index
              element={
                <ProtectedPage>
                  <HomePage /> {/* Using HomePage as landing */}
                </ProtectedPage>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedPage>
                  <RegisterPage />
                </ProtectedPage>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedPage>
                  <LoginPage />
                </ProtectedPage>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="*"
              element={
                <ProtectedPage>
                  <NotFound />
                </ProtectedPage>
              }
            />

            {/* DISABLED ROUTES */}
            <Route path="/support" element={<SupportPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
