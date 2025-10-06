import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"]; // Blue, Yellow, Green, Red

const AdminDashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_ADMIN_DASHBOARD_DATA);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <DashboardLayout activeMenu="Dashboard">Loading...</DashboardLayout>;

  if (!dashboardData) return (
    <DashboardLayout activeMenu="Dashboard">
      <p className="text-red-500">Failed to load dashboard data</p>
    </DashboardLayout>
  );

  const {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    completionRate,
    totalUsers,
    userStats,
  } = dashboardData;

  const pieData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
    { name: "Overdue", value: overdueTasks },
  ];

  return (
    <DashboardLayout activeMenu="Dashboard">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-xl font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Overdue Tasks</h3>
          <p className="text-xl font-bold text-red-500">{overdueTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Completion Rate</h3>
          <p className="text-xl font-bold">{(completionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
      </div>

      {/* Task Distribution Pie Chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Stats Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Created Tasks</th>
                <th className="px-4 py-2">Pending</th>
                <th className="px-4 py-2">In Progress</th>
                <th className="px-4 py-2">Completed</th>
                <th className="px-4 py-2">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.tasksCreated}</td>
                  <td className="px-4 py-2">{u.assignedTasks.pending}</td>
                  <td className="px-4 py-2">{u.assignedTasks.inProgress}</td>
                  <td className="px-4 py-2">{u.assignedTasks.completed}</td>
                  <td className="px-4 py-2 text-red-500">{u.assignedTasks.overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
