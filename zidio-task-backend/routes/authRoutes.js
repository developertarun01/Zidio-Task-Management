const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
// const verifyToken =require("../middleware/verifyToken");
dotenv.config();

// Register Endpoint
router.post("/register", async (req, res) => {
  console.log("Request body:", req.body); // Check if data is being received
  try {
    const { username, email, password } = req.body;
    // const hash = await bcrypt.hash(password, 12);
    // res.redirect("http://localhost:3000/dashboard");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
      // .redirect("http://localhost:3000/login");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      redirect: "/dashboard",
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ redirect: "/home", message: "Email already registered" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid credentials", redirect: "/register" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretkey");
  // res.json({ token });
  //   return success response
  res.status(200).json({
    message: "Login Successful",
    email: user.email,
    token,
  });
  console.log({ message: "login successful" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("http://localhost:3003/");
  console.log({ message: "Logged out successfully" });
});

module.exports = router;
