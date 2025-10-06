const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get all users (Admin only)
// @route   Get/api/users
// @access  Private (Admin) 
const getUsers = async (req, res) => {
    try{
        const users = await User.find({role: "member"}).select("-password");

        const userWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    createdBy: user._id,
                    status: "Pending"
                });
                const inProgressTasks = await Task.countDocuments({
                    createdBy: user._id,
                    status: "In Progress"
                });
                const completedTasks = await Task.countDocuments({
                    createdBy: user._id,
                    status: "Completed"
                });

                return{
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks
                };
            })
        );


        res.json(userWithTaskCounts);

    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get User by ID
// @route   Get /api/user/:id
// @access  Private
const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message: "Server error", error: error.message});
        res.json(user);
    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

module.exports = {getUsers,getUserById};