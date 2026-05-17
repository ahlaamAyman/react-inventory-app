import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("كلمات المرور الجديدة غير متطابقة!");
    }
    toast.success("تم تحديث كلمة المرور بنجاح!");
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between border-b dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-2xl font-black dark:text-white leading-none tracking-tight">Security & Privacy</h2>
          <p className="text-sm text-gray-400 mt-2 font-medium">Manage your password and protect your account.</p>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-600 shadow-sm border border-red-100 dark:border-transparent">
          <i className="fas fa-shield-alt text-xl"></i>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Current Password</label>
          <input 
            required
            type="password" 
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
            className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-red-500 transition-all font-bold shadow-inner"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">New Password</label>
          <input 
            required
            type="password" 
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-inner"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Confirm Password</label>
          <input 
            required
            type="password" 
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold shadow-inner"
            placeholder="••••••••"
          />
        </div>

        <div className="md:col-span-2 pt-6 flex justify-end">
          <button 
            type="submit"
            className="px-12 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;