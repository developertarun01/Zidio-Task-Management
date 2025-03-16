const express = require("express");
const { signup, login } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv")
dotenv.config()
const router = express.Router();

// ✅ Route for User Register
router.post("/register", signup, async (req, res) => {
   console.log("Request body:", req.body); // Check if data is being received
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ redirect: "http://localhost:3001/", message: "User already exists" });
    }
    // new User, saved to the database
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // if occur mongoDB duplicate email error 
    if (error.code === 11000) {
      res
        .status(400)
        .json({ redirect: "http://localhost:3001/", message: "Email already registered" }); // redirect to login page
    } else {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
});

// ✅ Route for User Login
router.post("/login", login, async (req, res) => {
 const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials",redirect:("http://localhost:3001/register") });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretkey");
  // res.json({ token });
  //   return success response
  res.status(200).json({
    message: "Login Successful",
    email: user.email,
    token,
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  console.log({ redirect: "/http://localhost:3001/", message: "Logged out successfully" });
 
});
module.exports = router;
