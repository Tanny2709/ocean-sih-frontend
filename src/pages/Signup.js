import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "analyst",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      setMessage("User registered successfully!");
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Context */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 text-white p-12 flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">
          Join the Ocean Hazard Reporting Platform
        </h1>
        <p className="mb-4 text-lg leading-relaxed">
          Help build safer coasts by contributing to{" "}
          <span className="font-semibold">real-time hazard reporting</span> and{" "}
          <span className="font-semibold">social media analytics</span>.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Register as Analyst or Admin</li>
          <li>Collaborate on real-time hazard monitoring</li>
          <li>Access role-specific dashboards</li>
        </ul>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 outline-none"
            >
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Signup
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
