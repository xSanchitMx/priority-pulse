import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASKS);
      setTasks(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task update
  const handleUpdate = async (taskId, updatedFields) => {
    try {
      setUpdatingTaskId(taskId);
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), updatedFields);
      // Update local state
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? { ...task, ...updatedFields } : task))
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Handle task delete
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (loading) return <DashboardLayout activeMenu="Manage Tasks">Loading...</DashboardLayout>;
  if (error) return <DashboardLayout activeMenu="Manage Tasks">{error}</DashboardLayout>;

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="space-y-4 space-x-4 flex flex-wrap">
        {tasks.length === 0 && <p>No tasks found.</p>}

        {tasks.map((task) => (
          <div key={task._id} className="p-4 bg-white rounded shadow flex flex-col gap-3">
            <input
              type="text"
              defaultValue={task.title}
              className="border rounded px-2 py-1 w-full"
              onBlur={(e) => handleUpdate(task._id, { title: e.target.value })}
              disabled={updatingTaskId === task._id}
            />
            <textarea
              defaultValue={task.description}
              className="border rounded px-2 py-1 w-full"
              onBlur={(e) => handleUpdate(task._id, { description: e.target.value })}
              disabled={updatingTaskId === task._id}
            />
            <div className="flex gap-2 flex-wrap">
              <select
                defaultValue={task.priority}
                onChange={(e) => handleUpdate(task._id, { priority: e.target.value })}
                disabled={updatingTaskId === task._id}
                className="border rounded px-2 py-1"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                defaultValue={task.dueDate.slice(0, 10)}
                onBlur={(e) => handleUpdate(task._id, { dueDate: e.target.value })}
                disabled={updatingTaskId === task._id}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
