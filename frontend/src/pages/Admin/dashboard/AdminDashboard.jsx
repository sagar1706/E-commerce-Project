// AdminDashboard.jsx
import React from "react";
import Sidebar from "../../../components/admin/Sidebar";
import { Outlet } from "react-router-dom"; // For nested routes

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
