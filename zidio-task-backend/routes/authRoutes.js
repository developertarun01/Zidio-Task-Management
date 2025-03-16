const express = require("express");
const { signup, login } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// ✅ **Updated: User Signup Route**
router.post("/signup", async (req, res) => {
  console.log("Signup request body:", req.body); // Debugging log

  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password: hash }); // ✅ Store hashed password
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ **User Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey");

  res.status(200).json({
    message: "Login Successful",
    email: user.email,
    token,
  });
});

// ✅ **Logout Route**
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
