import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/authLayout'
import {useNavigate} from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("");

    //Login API Call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      
      //console.log("Login response:", response.data); // DEBUGGING

      const {token, role} = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        if(role === "admin")
          navigate("/admin/admindashboard");
        else
          navigate("/user/dashboard");
      }
    }
    catch(error){
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return <AuthLayout>
    <div className="lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center">
      <h3 className='text-xl font-semibold text-black'>Welcome Back!</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>

      <form onSubmit={handleLogin}>
        <Input value={email}
        onChange={({target}) => setEmail(target.value)}
        label = "Email Address"
        placeholder="name@example.com"
        type="text"
        />

        <Input value={password}
        onChange={({target}) => setPassword(target.value)}
        label = "password"
        placeholder="Minimum 8 Characters"
        type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className='btn-primary'>LOGIN</button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <Link className="font-medium text-primary underline" to="/signup">
             Sign Up
          </Link>
        </p>

      </form>
    </div>
  </AuthLayout>
  
}

export default Login