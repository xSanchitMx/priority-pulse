import React, { useContext, useState } from 'react' 
import AuthLayout from '../../components/layouts/authLayout'
import { validateEmail } from '../../utils/helper';
import Input from '../../components/Inputs/Input';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!fullName){
      setError("Please enter a valid name");
      return;
    }
  
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
  
    if(!password){
      setError("Please enter a valid password");
      return;
    }
  
    setError("");
  
    //SignUp API Call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password
        });

        const {token, role} = response.data;

        if(token)
        {
          localStorage.setItem("token", token);
          updateUser(response.data);
          
          if(role === "admin") navigate("/admin/admindashboard");
          else navigate("/user/dashboard")
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

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black mb-5">Create an Account</h3>
      
      <form onSubmit={handleSignUp}>
        <Input value={fullName}
        onChange={({target}) => setFullName(target.value)}
        label = "Full Name"
        placeholder="John Doe"
        type="text"
        />

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

        <button type="submit" className='btn-primary'>Sign Up</button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <Link className="font-medium text-primary underline" to="/login">
             Login
          </Link>
        </p>
      </form>
      
      </div>
    </AuthLayout>
  )
}

export default SignUp 