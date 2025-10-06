import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const CustomTaskSorter = () => {
  const [tasks, setTasks] = useState([]);
  const [weights, setWeights] = useState({
    deadline: 1,
    aging: 1,
    priority: 1,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASKS);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };
    fetchTasks();
  }, []);

  const calculateScore = (task) => {
    const now = new Date();

    // Deadline score: nearer deadlines should score higher
    const dueDate = new Date(task.dueDate);
    const timeToDeadline = (dueDate - now) / (1000 * 60 * 60 * 24); // days left
    const deadlineScore = timeToDeadline <= 0 ? 100 : 1 / (timeToDeadline + 1);

    // Aging score: older tasks score higher
    const createdDate = new Date(task.createdDate);
    const ageDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    const agingScore = ageDays;

    // Priority score: map Low/Medium/High → 1/2/3
    const priorityMap = { Low: 1, Medium: 2, High: 3 };
    const priorityScore = priorityMap[task.priority] || 1;

    // Weighted sum
    return (
      weights.deadline * deadlineScore +
      weights.aging * agingScore +
      weights.priority * priorityScore
    );
  };

  // Sort tasks by calculated score
const sortedTasks = [...tasks]
  .filter((task) => task.status !== "Completed") 
  .sort((a, b) => calculateScore(b) - calculateScore(a));


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Custom Task Sorting</h2>

        {/* Sliders */}
        <div className="flex flex-col gap-4 mb-6">
          <label>
            Deadline Weight: {weights.deadline}
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.deadline}
              onChange={(e) =>
                setWeights({ ...weights, deadline: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Aging Weight: {weights.aging}
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.aging}
              onChange={(e) =>
                setWeights({ ...weights, aging: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Priority Weight: {weights.priority}
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={weights.priority}
              onChange={(e) =>
                setWeights({ ...weights, priority: Number(e.target.value) })
              }
            />
          </label>
        </div>

        {/* Task list */}
        <div className="grid gap-4">
          {sortedTasks.map((task) => ( 
            <div
              key={task._id}
              className="p-4 border rounded shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex gap-3 mt-2 text-sm">
                <span>Status: {task.status}</span>
                <span>Priority: {task.priority}</span>
                <span>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTaskSorter;
