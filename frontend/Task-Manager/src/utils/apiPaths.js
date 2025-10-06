export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },

    USERS: {
        GET_ALL_USERS: "/api/users", //Admin Only
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
        GET_ADMIN_DASHBOARD_DATA: "/api/tasks/admin-dashboard-data",
        GET_TASKS: "/api/tasks/",
        GET_TASK_BY_STATUS: "/api/tasks/status",
        GET_TASK_BY_ID:(taskId) => `/api/tasks/${taskId}`,
        CREATE_TASK: "/api/tasks/",
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    }
}