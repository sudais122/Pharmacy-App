
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";

import loginUser from "../../api/authapi";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Frontend validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      // Send real form data to backend
      const data = await loginUser(
        email.trim(),
        password
      );

      console.log("Login successful:", data);

      // Store access token
      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Pill
              size={26}
              className="text-green-600"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your Pharmacy Management System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg outline-none text-sm
              focus:border-green-500 focus:ring-2 focus:ring-green-100
              placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full h-11 pl-10 pr-11 border border-gray-300 rounded-lg outline-none text-sm
              focus:border-green-500 focus:ring-2 focus:ring-green-100
              placeholder:text-gray-400"
            />

            {/* Show / Hide password */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600
              cursor-pointer"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />

            Remember me
          </label>

          <button
            type="button"
            className="text-sm text-green-600 hover:text-green-700
            font-medium cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-green-600 hover:bg-green-700
          disabled:bg-green-400 disabled:cursor-not-allowed
          text-white rounded-lg font-medium text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-green-500
          focus:ring-offset-2 cursor-pointer"
        >
          {loading
            ? "Signing in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
