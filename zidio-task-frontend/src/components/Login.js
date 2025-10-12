import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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
        "https://zidio-task-management-tanmoy9088.onrender.com/api/auth/login",
        { email: inputs.email, password: inputs.password },
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

  // Define a custom class for large, eye-catching text (assuming a modern font like Poppins/Inter is imported)
  const fontDisplayClass = "font-extrabold tracking-tight font-sans"; 
  const accentColor = "text-orange-400"; // A high-contrast color for accents

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${fontDisplayClass}`}>
      {/* BACKGROUND: Changed to a Deep Violet/Indigo base color */}
      <div className="absolute inset-0 z-0 bg-[#1a0f3d]" /> 
      
      {/* BLOBS: Updated colors to Cyan, Magenta, and Orange for vibrancy */}
      <div className="absolute inset-0 z-0">
        <div className="blob bg-cyan-400" style={{ top: "10%", left: "15%" }} />
        <div className="blob bg-fuchsia-500" style={{ top: "40%", left: "70%" }} />
        <div
          className="blob bg-orange-500"
          style={{ top: "75%", left: "30%" }}
        />
      </div>
      
      {/* Particles */}
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 px-6 py-12 w-full max-w-6xl">
          {/* Left Text Column */}
          <div className="flex flex-col text-center md:text-left gap-6">
            <h1 className={`text-6xl ${fontDisplayClass} text-white text-center drop-shadow-lg`}>
              Task <span className={accentColor}>Manager</span>
            </h1>
            <p className="text-gray-300 text-center text-xl font-light max-w-md mx-auto">
              You are one step away from amazing features. Log in to manage all your tasks in one place.
            </p>
          </div>

          {/* Right Login Form */}
          <motion.form
            ref={formRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTransform}
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-center max-w-md stylish-card"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, delay: 0.4 }}
            autoComplete="on"
          >
            <h2 className={`text-3xl ${fontDisplayClass} text-white text-center mb-6`}>
              Welcome Back
            </h2>
            <Textbox
              name="email"
              label="Enter your email"
              type="email"
              value={inputs.email}
              onChange={handleChange}
              // Update Textbox input styling for better visibility on dark background
              className="text-white w-full border-gray-600 focus:border-cyan-400"
              required
            />
            <Textbox
              label="Password"
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              className="text-white w-full border-gray-600 focus:border-cyan-400"
              required
            />
            {/* Login Button: Updated to use the primary accent color (Orange/Cyan gradient) */}
            <button
              type="submit"
              className="login-button w-full mt-8 py-3 text-xl font-bold text-gray-900 rounded-full bg-orange-400 hover:bg-orange-300 transition-all duration-300"
            >
              Login Securely
            </button>
            <p className="text-center text-sm text-gray-400 mt-6">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Sign Up Now
              </button>
            </p>
          </motion.form>
        </div>
      </motion.div>

      {/* --- Style Block: Focused on updated colors and button glow --- */}
      <style>{`
        /* Import a custom font if available, or rely on system stack */
        /* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap'); */
        
        /* Global font application via tailwind.config or a base CSS file is better, 
           but applying here for immediate effect: */
        .font-sans {
            font-family: 'Inter', 'Poppins', sans-serif;
        }

        /* Blob animations - keeping physics, just updating colors in JSX */
        @keyframes blobFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-40px, 30px) scale(0.95); }
        }
        .blob {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5; /* Reduced opacity slightly */
          animation: blobFloat 25s infinite ease-in-out;
          mix-blend-mode: screen;
        }
        .particle {
          /* ... existing particle styles ... */
        }
        @keyframes twinkle {
            /* ... existing twinkle styles ... */
        }
        
        /* Stylish Card: Keeping the glass effect but toning down the shadow to fit the dark background */
        .stylish-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5); /* Darker shadow */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          will-change: transform;
        }

        .stylish-card:hover {
          /* Highlight on hover with a Cyan/Violet glow */
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
                      0 0 60px rgba(100, 50, 200, 0.2); 
        }

        /* Custom glow for the new Login Button */
        .login-button {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); /* Yellow/Orange glow */
            border: none;
        }
        .login-button:hover {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.9);
            transform: translateY(-2px);
        }
        
        /* Removed .neon-button specific styles as the new button uses a simpler, cleaner glow effect */
        
      `}</style>
    </div>
  );
};

export default Login;