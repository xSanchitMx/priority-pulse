import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance"; // use your axiosInstance
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
        setTask(response.data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(id), { status: newStatus });
      setTask((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <DashboardLayout activeMenu="My Tasks">Loading...</DashboardLayout>;
  if (!task) return <DashboardLayout activeMenu="My Tasks">Task not found</DashboardLayout>;

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
        <p className="mb-4">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <p>
            <strong>Status:</strong>{" "}
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={updating}
              className="border rounded px-2 py-1"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Created On:</strong> {new Date(task.createdDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {new Date(task.updatedAt || task.createdDate).toLocaleString()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
