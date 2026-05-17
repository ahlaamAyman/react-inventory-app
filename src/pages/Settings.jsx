import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import ProfileSettings from './ProfileSettings';
import NotificationsSettings from './NotificationsSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { name: 'Profile', icon: 'fas fa-user-circle' },
    { name: 'General', icon: 'fas fa-cog' },
    { name: 'Notifications', icon: 'fas fa-bell' },
    { name: 'Security', icon: 'fas fa-shield-alt' },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          Configure your store layout and update your security preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 1. القائمة الجانبية (Sidebar Tabs) */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 active:scale-98 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 translate-x-2' 
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <i className={`${tab.icon} text-lg ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}></i>
                <span className="text-sm tracking-wide">{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700 transition-all">
          
          {activeTab === 'Profile' && <ProfileSettings />}
          {activeTab === 'General' && <GeneralSettings />}
          {activeTab === 'Notifications' && <NotificationsSettings />}
          {activeTab === 'Security' && <SecuritySettings />}
          
        </div>

      </div>
    </div>
  );
};

export default Settings;