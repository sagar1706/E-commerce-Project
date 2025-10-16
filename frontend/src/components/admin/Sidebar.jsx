// Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul className="flex flex-col gap-4">
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/admin/products/listproducts")}
        >
          Products
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/admin/orders")}
        >
          Orders
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/")}
        >
          Back to Home
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
