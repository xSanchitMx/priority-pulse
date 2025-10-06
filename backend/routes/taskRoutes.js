const express = require("express");
const {protect, adminOnly} = require("../middlewares/authMiddleware");
const { getDashboardData, getAdminDashboardData, getTasks, getTaskByStatus, createTask, updateTask, deleteTask, updateTaskStatus, getTaskById } = require("../controllers/taskController");

const router = express.Router();

router.get("/dashboard-data", protect, getDashboardData);
router.get("/admin-dashboard-data", protect, adminOnly, getAdminDashboardData);
router.get("/",protect,getTasks);
router.get("/status", protect, getTaskByStatus);
router.get("/:id", protect, getTaskById);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);

module.exports = router;