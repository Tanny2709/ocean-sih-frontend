import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setMessage(`Logged in as ${res.data.role}`);

      if (res.data.role === "admin") navigate("/admin-dashboard");
      else if (res.data.role === "analyst") navigate("/analyst-dashboard");
      else navigate("/user-dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Problem Statement / Intro */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 text-white p-12 flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">
          Integrated Platform for Crowdsourced Ocean Hazard Reporting & Analytics
        </h1>
        <p className="mb-4 text-lg leading-relaxed">
          INCOIS provides critical ocean hazard early warnings for tsunamis,
          storm surges, high waves, and more. This platform enables{" "}
          <span className="font-semibold">
            citizens, officials, and analysts
          </span>{" "}
          to collaborate by reporting geotagged incidents, uploading media, and
          monitoring hazard-related discussions from social media.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Submit real-time hazard reports with photos/videos</li>
          <li>Visualize crowdsourced data & social media activity</li>
          <li>Track hotspots and sentiment for faster responses</li>
          <li>Role-based dashboards for citizens, analysts & admins</li>
        </ul>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to Continue
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
