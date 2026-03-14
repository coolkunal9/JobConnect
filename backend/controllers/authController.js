const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token using user id
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d", // token expires in 7 days
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, company, phone, skills, bio } =
            req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role,
            company,
            phone,
            skills,
            bio,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                skills: user.skills,
                bio: user.bio,
                token: generateToken(user._id),
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                skills: user.skills,
                bio: user.bio,
                resume: user.resume,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private
const getMe = async (req, res) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.skills = req.body.skills || user.skills;
            user.company = req.body.company || user.company;
            user.phone = req.body.phone || user.phone;

            // Only update password if provided
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                company: updatedUser.company,
                skills: updatedUser.skills,
                bio: updatedUser.bio,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };