

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


   const handleLogin = (e) => {
  e.preventDefault();

  const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

  if (savedUser && email === savedUser.email && password === savedUser.password) {
    
    const fakeData = {
      user: savedUser,
      token: "JWT_" + Math.random().toString(36).substr(2) 
    };

    dispatch(loginSuccess(fakeData)); 
    toast.success(`Welcome back, ${savedUser.name}!`);
    navigate('/'); 

  } else {
    toast.error("Invalid email or password. Please try again.");
  }
};




  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-[30px] shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-black text-white mb-8 text-center">System Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 rounded-2xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="admin@store.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Password</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-2xl bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            Login to Dashboard
          </button>
          <p className="text-white mt-4">
             Don't have an account? 
               <button onClick={() => navigate('/signup')} className="text-blue-400 ml-2">
                  Sign Up
               </button>
 
          </p>
        </form>
      </div>
    </div>



  )
}

export default Login
