import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-600 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full transform transition-transform duration-300 hover:scale-[1.03]"
        aria-label="Login form"
      >
        <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-10">
          Welcome Back!
        </h2>

        {error && (
          <div
            className="mb-6 rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 transition"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-purple-600 py-3 text-white font-bold shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition"
        >
          Log In
        </button>

        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm select-none">
            or continue with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
        </div>

        {/* Uncomment and replace with your actual GoogleAuthButton component if available */}
        {/*
        <GoogleAuthButton
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 py-2 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition"
        />
        */}

        {/* <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full mt-6 rounded-md bg-gray-200 py-2 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition"
          aria-label="Test Dashboard Redirect"
        >
          Test Dashboard Redirect
        </button> */}

        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-8">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline focus:outline-none"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
