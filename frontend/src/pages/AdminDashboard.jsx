import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  // Only show alert if someone is logged in but not admin
  if (user && user.role !== "admin") {
    alert("Access denied! Admins only.");
    navigate("/"); 
  } 
  // If user is null, just navigate without alert (logged out case)
  else if (!user) {
    navigate("/login"); // or home page
  }
}, [user, navigate]);


  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Sidebar, Products, Orders etc */}
    </div>
  );
};

export default AdminDashboard;
