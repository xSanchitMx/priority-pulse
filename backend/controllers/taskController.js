const Task = require("../models/Task");
const User = require("../models/User")

// @desc    Get all tasks 
// @route   GET /api/tasks/
// @access  Private
const getTasks = async(req, res) => {
    try{
        const tasks = await Task.find({
            createdBy: req.user._id
        })

        res.json(tasks);

    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/status
// @access  Private
const getTaskByStatus = async(req,res) => {
    try{
        const {status} = req.query;

        const tasks = await Task.find({
            createdBy: req.user._id,
            status: status,
        });

        res.json(tasks);
        

    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Create a new task
// @route   POST /api/tasks/
// @access  Private
const createTask = async(req,res) => {
    try{
        const {
            title,
            description,
            priority,
            dueDate,
        } = req.body;

        const task = await Task.create({
            title,
            description,
            priority,
            status: "Pending",
            createdDate: new Date(),
            dueDate,
            createdBy: req.user._id
        })

        res.status(201).json({message: "Task created succesfully", task});
    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async(req,res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message: "Task not found"});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;

        const updatedTask = task.save();
        res.json({message: "Task updated successfully", updatedTask});
    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Delete a task
// @route   Delete /api/tasks/:id
// @access  Private
const deleteTask = async(req,res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message: "Task not found"});

        await task.deleteOne();
        res.json({message: "Task deleted successfully"});

    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async(req,res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message: "Task not found"});

        const {status} = req.body;
        task.status = status || task.status;
        const updatedTask = await task.save();
        return res.json({message: "Task status succesfully updated", updatedTask});

    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Dashboard Data
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async(req,res) => {
    try{
        const pendingTasks = await Task.countDocuments({createdBy: req.user._id, status: "Pending"});
        const inProgressTasks = await Task.countDocuments({createdBy: req.user._id, status: "In Progress"});
        const completedTasks = await Task.countDocuments({createdBy: req.user._id, status: "Completed"});
        const totalTasks = pendingTasks + inProgressTasks + completedTasks;

        const overdueTasks = await Task.countDocuments({
            createdBy: req.user._id,
            status: {$ne: "Completed"},
            dueDate: {$lt: new Date()}
        })

        res.status(200).json({
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks
        });
    } catch(error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get admin dashboard data (admin only)
// @route   GET /api/tasks/admin-dashboard-data
// @access  Private (Admin only)
const getAdminDashboardData = async (req, res) => {
    try {
        // 1. Global Task Stats
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // 2. User stats
        const users = await User.find({ role: "member" }).select("-password");
        const userStats = await Promise.all(
            users.map(async (user) => {
                const createdCount = await Task.countDocuments({ createdBy: user._id });
                const pending = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
                const inProgress = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
                const completed = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });
                const overdue = await Task.countDocuments({
                    assignedTo: user._id,
                    status: { $ne: "Completed" },
                    dueDate: { $lt: new Date() }
                });

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    tasksCreated: createdCount,
                    assignedTasks: {
                        pending,
                        inProgress,
                        completed,
                        overdue
                    }
                };
            })
        );

        // 3. Completion rate
        const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;

        res.status(200).json({
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks,
            completionRate,
            totalUsers: users.length,
            userStats
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {getTaskById, getTasks, getTaskByStatus, createTask, updateTask, deleteTask, updateTaskStatus, getDashboardData, getAdminDashboardData};