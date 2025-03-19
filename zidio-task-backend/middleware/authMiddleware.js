const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token

    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

module.exports = authenticateUser;