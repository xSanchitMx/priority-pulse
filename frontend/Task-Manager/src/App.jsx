import React, { useContext } from 'react'
import{
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/User/Dashboard';
import CreateTask from './pages/User/CreateTask';
import MyTasks from './pages/User/MyTasks';
import ManageTasks from './pages/User/ManageTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';


const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user/dashboard" element={<Dashboard />} />
          <Route path="/user/create-task" element={<CreateTask />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/manage-tasks" element={<ManageTasks />} />
          <Route path="/user/tasks/:id" element={<ViewTaskDetails />} />

          <Route element={<PrivateRoute allowedRoles={["admins"]}/>}>
             <Route path="/Admin/AdminDashboard" element={<AdminDashboard />} />
          </Route>

          <Route path='/' element={<Root/>} />
        </Routes>
      </Router>
    </div>
    </UserProvider>
  )
}

export default App;

const Root = () => {
  const {user, loading} = useContext(UserContext);
  //console.log("Root -> user:", user, "loading:", loading); //DEBUGGING

  //if (loading) return <p>Loading...</p>; 

  if(loading) return <Outlet/>

  if(!user){
    return <Navigate to="/login"></Navigate>;
  }

  return user.role === "admin" ? <Navigate to="/admin/admindashboard"/>:<Navigate to="/user/dashboard"/>;
};