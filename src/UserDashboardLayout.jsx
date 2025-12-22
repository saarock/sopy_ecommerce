import React from "react";
import { Outlet } from "react-router-dom";
import UserDashBoardNav from "./components/userDashBoardNav/UserDashBoardNav";
import Header from "./components/header/header";
import Footer from "./components/footer/footer.jsx";
import { ToastContainer } from "react-toastify";
import useSocket from "./hooks/useSocket.jsx";
import NotificationToast from "./components/NotificationToast.jsx";

const UserDashboardLayout = () => {
  const { message, numberOfNotifications } = useSocket();

  return (
    <div className="dashboard-layout">
      <Header />
      <ToastContainer position="top-left" />
      <NotificationToast />
      <div className="adminDashContainer flex relative">
        <div className="sticky top-0 z-50">
          <UserDashBoardNav />
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

export default UserDashboardLayout;
