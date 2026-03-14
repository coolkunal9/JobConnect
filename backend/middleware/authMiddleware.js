const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    // Check if token exists in request headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from header
            // Header looks like: "Bearer eyJhbGc..."
            token = req.headers.authorization.split(" ")[1];

            // Verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database using id from token
            // .select("-password") means don't return password field
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (err) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Middleware to check if user is a recruiter
const recruiterOnly = (req, res, next) => {
    if (req.user && req.user.role === "recruiter") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, recruiters only" });
    }
};

// Middleware to check if user is a jobseeker
const jobseekerOnly = (req, res, next) => {
    if (req.user && req.user.role === "jobseeker") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, jobseekers only" });
    }
};

module.exports = { protect, recruiterOnly, jobseekerOnly };