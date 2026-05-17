import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const handleSignUp = (e) => {
  e.preventDefault();
  
  const newUser = {
    email: formData.email,
    password: formData.password,
    name: formData.username
  };

  localStorage.setItem('registeredUser', JSON.stringify(newUser));
  
  toast.success("Account created successfully! Please login.");
  navigate('/login');
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-black text-white text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username"
            className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm Password"
            className="w-full p-4 rounded-2xl bg-slate-700/50 text-white border border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 mt-4">
            Sign Up
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6 text-sm">
          Already have an account? 
          <button onClick={() => navigate('/login')} className="text-indigo-400 font-bold ml-2 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;