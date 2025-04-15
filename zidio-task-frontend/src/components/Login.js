import React, { useState } from "react";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the login request to the backend
      const response = await axios.post(
        "http://localhost:4004/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { token, user } = response.data;
      console.log(user);
      // On successful login, store role in cookie or localStorage

      if (!user) {
        console.error("User is missing in the response!", response.data);
        return;
      }

      // ✅ Save only the user object
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Save token if needed
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email); // Storing the role in localStorage
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role); // Storing the role in localStorage
    // Storing the role in localStorage
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/auth/google/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      // Handle errors, like incorrect login credentials
      if (error.response && error.response.status === 400) {
        toast.error("Register first");
        navigate("/register");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
  };

  // Navigate to register page
  const handleReg = async () => {
    navigate("/register");
  };

  // Navigate to forgot password page
  const handleForgot = async () => {
    navigate("/forget");
  };

  return (
    <motion.div
      className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* Left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
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

        {/* Right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <motion.form
            onSubmit={handleSubmit}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white shadow-xl rounded-2xl px-10 pt-14 pb-14"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome back!
              </p>
              <p className="text-center text-base text-gray-700 ">
                Keep all your credentials safe.
              </p>
            </div>

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
              />

              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                {/* {isRegistering ? "" : "Forget Password"} */}
              </span>
              <Button
                type="submit"
                label="Login"
                className="w-full h-10 bg-blue-700 text-white rounded-full"
              ></Button>
            </div>
            <span>
              <p className="text-center">
                Not Registered?
                <Button
                  className={"text-blue-500"}
                  onClick={handleReg}
                  label={"Sign Up"}
                ></Button>
              </p>
            </span>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
