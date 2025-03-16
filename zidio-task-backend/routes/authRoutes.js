const express = require("express");
const { signup, login } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const CLIENT_URL = "https://zidio-task-management-ruby.vercel.app";

// ✅ Route for User Registration
router.post("/signup", async (req, res) => {
  console.log("Request body:", req.body); // Debugging log
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ redirect: CLIENT_URL, message: "User already exists" });
    }

    // Create new user and save to database
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ redirect: CLIENT_URL, message: "Email already registered" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
});

// ✅ Route for User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials", redirect: CLIENT_URL + "/signup" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login Successful", email: user.email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Route for User Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ redirect: CLIENT_URL, message: "Logged out successfully" });
});

module.exports = router;
