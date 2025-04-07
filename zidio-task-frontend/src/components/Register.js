import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4004/api/auth/register",
        {
          username,
          email,
          password,
        }
      );
      console.log(response);

      if (response.status === 201) {
        alert(response.data.message);

        // Redirect to home page after successful registration
        navigate("/home");
      }
      if (response.status === 400) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        // If email already registered, redirect to login page
        navigate("/");
      } else {
        alert(error.response?.data?.message || "Registration failed");
      }
    }
  };
  const handleLog = async (e) => {
    e.preventDefault();
    try {
      navigate("/");
    } catch (error) {
      alert("error");
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row  bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {" "}
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your task in one place!
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

        {/* right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <motion.form
            onSubmit={handleSubmit}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white shadow-2xl rounded-2xl px-10 pt-14 pb-14"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
          >
            <div className="">
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome!
              </p>
              <p className="text-center text-base text-gray-700 ">
                Keep all your credential safe.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="username"
                type="text"
                name="username"
                label="Username"
                className="w-full rounded-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              ></Textbox>

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

              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                {/* {isRegistering ? "" : "Forget Password"} */}
              </span>
              <Button
                type="submit"
                label="Register"
                className="w-full h-10 bg-blue-700 text-white rounded-full"
              ></Button>
              {/* <Button
              type="submit"
              label="Submit"
              className="w-full h-10 bg-blue-700 text-white rounded-full"
            /> */}
              {/* <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={"single_host_origin"}
            /> */}
            </div>
            <div>
              <p className="text-center">
                Already Registered?
                <Button
                  className={"text-blue-500"}
                  onClick={handleLog}
                  label={"Login"}
                ></Button>
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
