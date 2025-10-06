import {LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_ADMIN_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/admindashboard"
    },
    {
        id: "02",
        label: "Logout",
        icon: LuLogOut, 
        path: "logout"
    },
];

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard"
    },
    {
        id: "02",
        label: "My Tasks",
        icon: LuClipboardCheck,
        path: "/user/tasks"
    },
    {
        id: "03",
        label: "Manage Tasks",
        icon: LuClipboardCheck,
        path: "/user/manage-tasks"
    },
    {
        id: "04",
        label: "Create Tasks",
        icon: LuClipboardCheck,
        path: "/user/create-task"
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut, 
        path: "logout"
    },
];

export const PRIORITY_DATA = [
    {label:"Low", value:"Low"},
    {label:"Medium", value:"Medium"},
    {label:"High", value:"High"},
]

export const STATUS_DATA = [
    {label:"Pending", value:"Pending"},
    {label:"In Progress", value:"In Progress"},
    {label:"Completed", value:"Completed"},
]