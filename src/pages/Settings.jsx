import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import ProfileSettings from './ProfileSettings';
import NotificationsSettings from './NotificationsSettings';

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { key: 'Profile', label: t('settings.tabs.profile'), icon: 'fas fa-user-circle' },
    { key: 'General', label: t('settings.tabs.general'), icon: 'fas fa-store' },
    { key: 'Notifications', label: t('settings.tabs.notifications'), icon: 'fas fa-bell' },
    { key: 'Security', label: t('settings.tabs.security'), icon: 'fas fa-shield-alt' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3.5 px-6 py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 active:scale-98 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 ltr:translate-x-1 rtl:-translate-x-1'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <i className={`${tab.icon} text-base`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel View */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
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