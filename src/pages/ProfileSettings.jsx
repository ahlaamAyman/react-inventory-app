import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: 'User Name',
    email: 'user@example.com',
    phone: '01007080342',
    role: 'Software Engineer'
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('تم تحديث بيانات الملف الشخصي بنجاح!');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-none">Profile Details</h2>
        <p className="text-sm text-gray-400 mt-2 font-medium">Manage your personal information and account avatar.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="flex items-center gap-6 bg-gray-50/50 dark:bg-slate-700/20 p-6 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700 w-fit">
          <div className="relative group w-24 h-24">
            <div className="w-full h-full rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-black border-2 border-white dark:border-slate-800 shadow-md">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <button type="button" className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 active:scale-95 transition-all">
              <i className="fas fa-camera text-xs"></i>
            </button>
          </div>
          <div>
            <h4 className="text-sm font-black dark:text-white">Profile Picture</h4>
            <p className="text-[11px] text-gray-400 mt-1">PNG or JPG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
            <input 
              required
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
            <input 
              required
              type="email" 
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Position</label>
            <input 
              type="text" 
              value={profile.role}
              disabled
              className="w-full p-4 rounded-[1.5rem] bg-gray-100 dark:bg-slate-700/50 border-none text-gray-400 dark:text-gray-500 font-bold cursor-not-allowed shadow-inner" 
            />
          </div>
        </div>

        <div className="pt-8 border-t dark:border-gray-700 flex justify-end">
          <button 
            type="submit"
            className="px-12 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;