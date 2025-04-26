import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = formRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const resetTransform = () => {
    if (formRef.current) {
      formRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://zidio-task-management-tanmoy9088.vercel.app/api/auth/login",
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

      navigate("/auth/google/dashboard");
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
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 animate-gradient" />
      <div className="absolute inset-0 z-0">
        <div className="blob bg-pink-500" style={{ top: "10%", left: "15%" }} />
        <div className="blob bg-blue-500" style={{ top: "40%", left: "70%" }} />
        <div
          className="blob bg-purple-500"
          style={{ top: "75%", left: "30%" }}
        />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 px-6 py-12 w-full max-w-6xl">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <h1 className="text-5xl font-bold text-white drop-shadow-md">
              Zidio Task Manager
            </h1>
            <p className="text-blue-300 text-lg">
              Manage all your tasks in one place.
            </p>
          </div>

          <motion.form
            ref={formRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTransform}
            onSubmit={handleSubmit}
            className="w-full max-w-md stylish-card text-blue-200 "
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, delay: 0.4 }}
            autoComplete="on"
          >
            <h2 className="text-3xl font-extrabold text-white text-center mb-4">
              Welcome Back
            </h2>
            <Textbox
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="text-white w-full"
              required
            />
            <Textbox
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-white w-full"
              required
            />
            <button
              type="submit"
              className="neon-button w-full mt-6 py-2 text-lg font-semibold text-white rounded-full bg-blue-700 hover:bg-blue-800 transition-all duration-300"
            >
              Login
            </button>
            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.form>
        </div>
      </motion.div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background: linear-gradient(270deg, #0f0c29, #302b63, #24243e);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
        }
        .blob {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.6;
          animation: blobFloat 25s infinite ease-in-out;
          mix-blend-mode: screen;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-40px, 30px) scale(0.95); }
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.3;
          animation: twinkle ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          color: white;
          will-change: transform;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
          .stylish-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
}

.stylish-card:hover {
  box-shadow: 0 0 20px rgba(100, 100, 255, 0.25),
              0 0 60px rgba(150, 150, 255, 0.15);
}

/* Add a focus glow to inputs if your Textbox component passes classes */
input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(0, 153, 255, 0.6);
  border-color: rgba(0, 153, 255, 0.8);
}

/* Neon button effect */
.neon-button {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.neon-button::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(120deg, #00f2fe, #4facfe, #00f2fe);
  animation: neonMove 3s linear infinite;
  z-index: -1;
  opacity: 0.4;
  filter: blur(10px);
}

@keyframes neonMove {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

      `}</style>
    </div>
  );
};

export default Login;
