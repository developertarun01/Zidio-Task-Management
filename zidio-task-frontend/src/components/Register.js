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
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();
  const soundRef = useRef(null);

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

      {/* Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/30 text-white backdrop-blur-md rounded-full text-sm shadow hover:bg-white/50 transition-all duration-300"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* 🎇 Starfield */}
      <div className={`starfield z-0 ${darkMode ? "dark-stars" : ""}`}>
        <div />
      </div>

      {/* 🫧 Bubbles */}
      <div className="absolute inset-2 z-0 flex items-center justify-center overflow-hidden">
        <div className={`bubble-effect ${darkMode ? "dark-bubbles" : ""}`} />
      </div>

      {/* 🎨 Background */}
      <div
        className={`absolute inset-0 z-[-2] ${
          darkMode ? "dark-bg" : "light-bg"
        }`}
      />

      {/* Page Content */}
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center z-10">
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center text-white text-center px-4 transition-all duration-500">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-white/50 text-white bg-white/20 backdrop-blur-md">
              Manage all your task in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black">
              <span>Zidio</span>
              <span>Task Manager</span>
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="z-10 w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center relative">
          <motion.form
            onSubmit={handleSubmit}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 glass-card px-10 pt-14 pb-14"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
          >
            <div>
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome!
              </p>
              <p className="text-center text-base text-gray-700 dark:text-gray-300">
                Keep all your credentials safe.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="username"
                className="w-full h-10 bg-blue-700  text-gray-200 rounded-full"
                type="text"
                name="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Textbox
                placeholder="email@example.com"
                className="w-full h-10 bg-blue-700  text-gray-200 rounded-full"
                type="email"
                name="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Textbox
                placeholder="your password"
                className="w-full h-10 bg-blue-700 text-gray-200 rounded-full"
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div>
                <label className="block mb-1 font-semibold text-gray-200 dark:text-gray-300">
                  Select Role:
                </label>
                <select
                  className="w-full px-4 py-2 rounded-full border h-10 text-slate-400"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                label="Register"
                className="w-full h-10 bg-blue-700 text-white rounded-full"
              />
            </div>

            <div className="text-center">
              <button
                className="text-blue-500 text-center hover:underline"
                onClick={handleLog}
              >
                Already have an account? Login
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
