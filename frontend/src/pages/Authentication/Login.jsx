import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginUser(email, password);

    if (res.status === "success") {
      const userData = res.user || { name: "User" }; // backend must return user info
      login(userData, res.token);
      alert("Login successful!");
      if (userData.role === "admin") {
        window.location.href = "/admin"; // admin dashboard route
      } else {
        window.location.href = "/"; // normal user home
      }
    } else {
      setError(res.message || "Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full border border-gray-300 p-3 rounded-lg mb-6"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link to Register page */}
        <p className="text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/auth/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
