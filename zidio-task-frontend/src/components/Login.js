import React, { useState } from "react";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client"; // Use the configured axios instance
import { useAuth } from "../context/AuthContext"; // Use auth context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login");
      
      // Specific handling for unregistered users
      if (error.response?.status === 400) {
        navigate("/register");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Zidio</span>
              <span>Task Manager</span>
            </p>
            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700">
                Keep all your credentials safe.
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-center text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                label={isLoading ? "Logging in..." : "Login"}
                className="w-full h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 disabled:bg-blue-400"
                disabled={isLoading}
              />
            </div>

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <span 
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;