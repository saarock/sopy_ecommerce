import { Outlet } from "react-router";

import AdminDashBoardNav from "./components/adminDashBoardNav/AdminDashBoardNav";

import { ToastContainer } from "react-toastify";
import Header from "./components/header/header";
import Footer from "./components/footer/footer.jsx";
import NotificationToast from "./components/NotificationToast.jsx";

const AdminDashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <ToastContainer position="top-left" />
      <NotificationToast />
      <div className="adminDashContainer flex relative">
        <div className="sticky top-0 z-50">
          <AdminDashBoardNav />
        </div>
        <div className="dashboard-content w-full">
          <Outlet />{" "}
          {/* This will render the specific dashboard page content */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardLayout;
