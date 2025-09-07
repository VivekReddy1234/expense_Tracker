import React from 'react'
import AuthLayout from '../components/layouts/AuthLayout'
import Input from '../components/Input'
import { useState } from 'react'
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'
import { UserContext } from '../context/userContext'
import {  useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { user, updateUser } = React.useContext(UserContext);
  const navigate = useNavigate();


const handleLogin = async (e) => {
  e.preventDefault(); 

  if(!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }

  if(password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  try {
    const response = await axiosInstance.post('/api/v1/auth/login', {
      email,
      password
    });

    // No need to store token in localStorage anymore!
    // Just use the cookie that server sets.

    const { user } = response.data; 
    console.log("Logged in user: ", user);

    if (user) {
      updateUser(user);   // keep context for UI
      navigate("/dashboard");
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }
};




  return (
    <AuthLayout>
    <div>
     <div className=' lg:w-[70%] md:w-[80%] sm:w-[90%] w-full mx-auto flex flex-col justify-center items-center h-screen'>
     
      <h3 className='text-xl  font-semibold text-black'>  Welcome Back</h3>
      <p className=' text-xs text-slate-700 mt-[5px] mb-6'>Please login to your account</p>

        <form onSubmit={handleLogin} className='w-full max-w-sm'>
        <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type='email'
        placeholder='example@gmail.com'
         />

         <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type='password'
        placeholder='*sdfad'
         />

         <button
         type='submit'
         className='w-full bg-purple-600 text-white py-2 rounded-md mt-4 hover:bg-purple-700 transition-colors duration-300'>
          Login
         </button>

         <p className='text-xs text-gray-500 mt-4'>Don't have an account? <a href='/signup' className='text-purple-600 hover:underline'>Sign Up</a></p>

        </form>
     
     </div>
    </div>

    </AuthLayout>
  )
}

export default LoginPage
 