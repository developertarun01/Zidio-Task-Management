import "./../styles/register.css";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// import toggleSoundFile from "../assets/toggle-sound.mp3";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [darkMode, setDarkMode] = useState(() => {
    // Assuming you want the dark theme as default for the vibrant look
    return localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme"); 
  });

  const navigate = useNavigate();
  const soundRef = useRef(null);
  
  // Custom class for eye-catching typography
  const fontDisplayClass = "font-extrabold tracking-tight font-sans"; 
  const primaryAccent = "text-cyan-400"; // Primary highlight color
  const secondaryAccent = "bg-orange-400"; // Button color

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
      const response = await axios.post(
        "https://zidio-task-management-tanmoy9088.onrender.com/api/auth/register",
        {
          username,
          email,
          password,
          role,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        const { user, token } = response.data;
        // localStorage.setItem("user", JSON.stringify(user));
        // localStorage.setItem("token", token);
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 409) navigate("/login");
      else alert(error.response?.data?.message || "Registration failed");
    }
  };

  const handleLog = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    soundRef.current?.play();
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    // You might also need to set a specific background here if not handled by CSS file
    document.body.style.backgroundColor = darkMode ? '#1a0f3d' : '#f0f4f8';
  }, [darkMode]);

  return (
    <motion.div
      className={`w-full min-h-screen flex items-center justify-center flex-col lg:flex-row overflow-hidden relative ${
        darkMode ? "dark" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 🔊 Audio ref */}
      {/* <audio ref={soundRef} src={toggleSoundFile} preload="auto" /> */}

      {/* Toggle Button: Using dark mode default for consistency */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/30 text-white backdrop-blur-md rounded-full text-sm shadow hover:bg-white/50 transition-all duration-300"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* 🎇 Starfield & 🫧 Bubbles (Assuming styles are defined in register.css) */}
      <div className={`starfield z-0 ${darkMode ? "dark-stars" : ""}`}><div /></div>
      <div className="absolute inset-2 z-0 flex items-center justify-center overflow-hidden">
        <div className={`bubble-effect ${darkMode ? "dark-bubbles" : ""}`} />
      </div>

      {/* 🎨 Background: Using a dark violet for visual appeal */}
      <div
        className={`absolute inset-0 z-[-2] ${
          darkMode ? "bg-[#1a0f3d]" : "bg-gray-100" // Deep violet base color
        } transition-colors duration-500`}
      />

      {/* Page Content */}
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center z-10">
        
        {/* Left Side: Marketing Text */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center text-white text-center px-4 transition-all duration-500 py-10 md:py-0">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10">
            <span className={`flex gap-1 py-2 px-5 border rounded-full text-sm md:text-base border-cyan-400/50 text-cyan-400 bg-white/10 backdrop-blur-md ${fontDisplayClass}`}>
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-5xl md:text-7xl 2xl:text-8xl font-black">
              {/* <span className={`text-white ${fontDisplayClass}`}></span> */}
              <span className={primaryAccent}>{`Task Manager`}</span>
            </p>
          </div>
        </div>

        {/* Right Form: Using the dark mode glass card look */}
        <div className="z-10 w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center relative">
          <motion.form
            onSubmit={handleSubmit}
            className="bg-[#000000] rounded-2xl form-container w-full md:w-[420px] flex flex-col gap-y-8 px-10 pt-14 pb-14 shadow-2xl" // Added dark mode styling to form
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
          >
            <div>
              <p className={`text-3xl ${primaryAccent} ${fontDisplayClass} text-center`}>
                Start Organizing
              </p>
              <p className="text-center text-base text-gray-400">
                Create your account in seconds.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              {/* Textboxes: Updated color classes for dark glass effect */}
              <Textbox
                // placeholder="username"
                className="w-full h-12 bg-white/10 border border-gray-600 text-white rounded-lg focus:border-cyan-400"
                type="text"
                name="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Textbox
                // placeholder="email@example.com"
                className="w-full h-12 bg-white/10 border border-gray-600 text-white rounded-lg focus:border-cyan-400"
                type="email"
                name="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Textbox
                // placeholder="your password"
                className="w-full h-12 bg-white/10 border border-gray-600 text-white rounded-lg focus:border-cyan-400"
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div>
                <label className="block mb-1 font-semibold text-white">
                  Select Role:
                </label>
                {/* Select: Updated color classes for dark glass effect */}
                <select
                  className="w-full px-4 py-2 rounded-lg border h-12 bg-white/10 text-white border-gray-600 focus:border-cyan-400 appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option className="bg-[#1a0f3d] text-white" value="user">User</option>
                  <option className="bg-[#1a0f3d] text-white" value="manager">Manager</option>
                  <option className="bg-[#1a0f3d] text-white" value="admin">Admin</option>
                </select>
              </div>

              {/* Button: Updated to the vibrant Orange accent */}
              <Button
                type="submit"
                label="Register Account"
                className={`w-full h-12 ${secondaryAccent} text-gray-900 font-extrabold text-lg rounded-lg shadow-xl hover:bg-orange-300 transition duration-300`}
              />
            </div>

            <div className="text-center">
              <button
                className="text-cyan-400 font-semibold hover:underline"
                onClick={handleLog}
              >
                Already have an account? Login here
              </button>
            </div>
          </motion.form>
        </div>
      </div>
      
      {/* Assuming .glass-card style is defined in register.css or the following style block */}
      <style>{`
        /* Minimal custom styles for the glass effect and general dark theme */
        .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        /* Override Textbox label color if needed */
        .form-container label {
            color: #ffffff; /* Ensures labels are white in dark mode */
        }
      `}</style>
    </motion.div>
  );
};

export default Register;