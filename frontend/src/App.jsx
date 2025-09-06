import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route,Routes } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Home from './pages/dashboard/Home'
import Income from './pages/dashboard/Income'
import Expense from './pages/dashboard/Expense'
import { Navigate } from 'react-router-dom'
import AuthLayout from './components/layouts/AuthLayout'
import UserProvider from './context/userContext.jsx'

import { Toaster } from 'react-hot-toast'

function App() {


  return (
   <><UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Home />} /> 
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense/>} />
      </Routes>
    </BrowserRouter>

     <Toaster 
     toastOptions={{
      className: "",
      style: {
        fontSize: '13px'
      },
     }}
     />
 
 </UserProvider>
   </>
  )
}

export default App


const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

   return isAuthenticated?(
    <Navigate to='/dashboard' />
   ): (
    <Navigate to='/login' />
   )
}; 
