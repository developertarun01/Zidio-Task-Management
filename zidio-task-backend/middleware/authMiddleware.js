const jwt = require("jsonwebtoken");
const { logSecurityEvent } = require("../utils/logger"); // Optional logger utility

const authenticateUser = (req, res, next) => {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        logSecurityEvent('Missing Authorization header', { url: req.originalUrl });
        return res.status(401).json({
            success: false,
            error: "Authentication required",
            code: "AUTH_HEADER_MISSING"
        });
    }

    // 2. Extract and verify token format
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== 'Bearer' || !token) {
        logSecurityEvent('Malformed Authorization header', { header: authHeader });
        return res.status(401).json({
            success: false,
            error: "Invalid authorization format",
            code: "AUTH_FORMAT_INVALID"
        });
    }

    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'], // Specify allowed algorithms
            ignoreExpiration: false // Explicitly check expiration
        });

        // 4. Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role, // Example additional field
            sessionId: decoded.sessionId // Example additional field
        };

        // Optional: Add token to request for downstream use
        req.token = token;

        // 5. Continue to next middleware
        next();
    } catch (error) {
        // 6. Handle specific JWT errors
        let errorMessage = "Invalid token";
        let errorCode = "TOKEN_INVALID";

        if (error.name === 'TokenExpiredError') {
            errorMessage = "Token expired";
            errorCode = "TOKEN_EXPIRED";
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = "Malformed token";
            errorCode = "TOKEN_MALFORMED";
        }

        logSecurityEvent('JWT verification failed', {
            error: error.message,
            code: errorCode
        });

        return res.status(401).json({
            success: false,
            error: errorMessage,
            code: errorCode,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = authenticateUser;