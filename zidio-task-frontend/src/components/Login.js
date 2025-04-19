import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
// import Logo from "../assets/zidio-logo-glow.png"; // 🟡 Make sure this image exists

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4004/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;
      if (!user) return;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      if (user.role === "admin") {
        navigate("/auth/google/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Register first");
        navigate("/register");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <motion.div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 🔵 Bubble Effect Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="animate-floating-bubble"
            style={{
              width: `${Math.random() * 25 + 30}px`, // Bubbles of different sizes
              height: `${Math.random() * 25 + 30}px`,
              left: `${Math.random() * 100}%`, // Random horizontal position
              animationDelay: `${Math.random() * 3}s`, // Random delay for each bubble
              animationDuration: `${Math.random() * 8 + 4}s`, // Random duration for smoothness
              bottom: `-${Math.random() * 40 + 20}px`, // Starting from random bottom position
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`, // Random colors
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-20 px-6 py-12 w-full max-w-6xl">
        {/* 🔷 Left: Logo & Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
          {/* <img
            // src={Logo}
            alt="Zidio Logo"
            className="w-40 drop-shadow-2xl animate-pulse"
          /> */}
          <h1 className="text-5xl font-bold text-white drop-shadow-md">
            Zidio Task Manager
          </h1>
          <p className="text-blue-300 text-lg">
            Manage all your tasks in one place.
          </p>
        </div>

        {/* 🔶 Right: Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-blue-700 text-center">
            Welcome Back
          </h2>
          <Textbox
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Textbox
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <Button
            type="submit"
            label="Login"
            className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800"
          />
          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </motion.form>
      </div>

      {/* 🔁 New Floating Bubble Animation Keyframes */}
      <style>{`
        @keyframes floating-bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-20vh) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(-40vh) scale(0.9);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-80vh) scale(1.2);
            opacity: 0;
          }
        }

        .animate-floating-bubble {
          animation-name: floating-bubble;
          animation-timing-function: ease-in-out;
          position: absolute;
          animation-iteration-count: infinite; /* Infinite loop of bubbles */
        }
      `}</style>
    </motion.div>
  );
};

export default Login;
