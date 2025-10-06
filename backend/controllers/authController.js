const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) =>
{
    return jwt.sign({id: userId}, process.env.JWT_SECRET);
}

// @desc    Refister a new user
// @route   Post /api/auth/Register
// @access  Public
const registerUser = async(req,res) => {
    try{
        const {name, email, password} = req.body;

        //Check if user already exists
        const userExists = await User.findOne({email});
        if(userExists)
        {
            return res.status(400).json({message: "User already exists"});
        }

        let role = "member";
        if(email == "mukherjee.sanchit@gmail.com") {
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl: null,
            role
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    }
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    }
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

// @desc    Get User Profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if (!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)   
const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || yser.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });
    }
    catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile};