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
import CustomTaskSorter from "../../components/ui/CustomTaskSorter";
import { Card } from "../../components/ui/Card";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"]; // Blue, Yellow, Green, Red

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch user dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <DashboardLayout activeMenu="Dashboard">Loading...</DashboardLayout>;

  if (!dashboardData)
    return (
      <DashboardLayout activeMenu="Dashboard">
        <p className="text-red-500">Failed to load dashboard data</p>
      </DashboardLayout>
    );

  const { totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks } =
    dashboardData;

  const pieData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
    { name: "Overdue", value: overdueTasks },
  ];

  return (
    <DashboardLayout activeMenu="Dashboard">
      <h2 className="text-2xl font-bold mb-6">My Dashboard</h2>
      <div className="flex gap-10">
        <div className="flex-col">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-xl font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-xl font-bold text-yellow-600">{pendingTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-xl font-bold text-blue-600">{inProgressTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-xl font-bold text-green-600">{completedTasks}</p>
        </div>
      </div>

      {/* Overdue Section */}
      <div className="p-4 bg-white shadow rounded-lg mb-8">
        <h3 className="text-gray-500 text-sm">Overdue Tasks</h3>
        <p className="text-xl font-bold text-red-600">{overdueTasks}</p>
      </div>

      {/* Task Distribution Pie Chart */}
      <div className="bg-white shadow rounded-lg p-6">
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
      </div>
      <Card>
      <CustomTaskSorter/>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
