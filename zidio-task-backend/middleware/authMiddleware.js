const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = {
      id: user._id,
      role: user.role,
      name: decoded.name, // <-- 👈 this is what was missing
      email: user.email,
    };
    // console.log("User verified:", req.user); // Log the verified user
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);

    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

module.exports = { verifyToken, allowRoles };
