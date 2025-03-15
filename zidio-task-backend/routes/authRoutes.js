const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// ✅ Route for User Signup
router.post("/signup", signup);

// ✅ Route for User Login
router.post("/login", login);

module.exports = router;
