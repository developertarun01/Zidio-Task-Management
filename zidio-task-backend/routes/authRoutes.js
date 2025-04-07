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
    const { role, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ role, username, email, password });
    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );
    //Store cookie
    res.cookie("token", token);
    res.status(201).json({
      redirect: "/dashboard",
      role: user.role,
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

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    "secretkey",
    { expiresIn: "1d" }
  );
  //Store cookie
  res.cookie("token", token);
  //   return success response
  res.status(200).json({
    message: "Login Successful",
    role: user.role,
    email: user.email,
    token,
  });
  console.log({ message: "login successful" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("http://localhost:3001/");
  console.log({ message: "Logged out successfully" });
});

module.exports = router;
