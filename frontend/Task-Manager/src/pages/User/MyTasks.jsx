import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      let response;

      if (filter === "All") {
        response = await axiosInstance.get(API_PATHS.TASKS.GET_TASKS);
      } else {
        response = await axiosInstance.get(
        `${API_PATHS.TASKS.GET_TASK_BY_STATUS}?status=${filter}`
        );
      }

      setTasks(response.data || []);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>

        {/* Filter dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Loading / Error / Task list */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tasks.map((task) => (
        <Link key={task._id} to={`/user/tasks/${task._id}`}>
          <Card className="cursor-pointer hover:shadow-lg transition">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold">{task.title}</h3>

              <div className="flex flex-wrap justify-between mt-2 text-sm gap-2">
                <span className="px-2 py-1 bg-gray-100 rounded">Status: {task.status}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">Priority: {task.priority}</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTasks;
