import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const NotificationsSettings = () => {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    lowStockAlert: true,
    weeklySummary: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userNotificationSettings');
      if (saved) setNotifications(JSON.parse(saved));
    } catch {
      // fallback to initial
    }
  }, []);

  const handleToggle = (field) => {
    setNotifications((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      try {
        localStorage.setItem('userNotificationSettings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('userNotificationSettings', JSON.stringify(notifications));
      toast.success(t('notifications.saved'));
    } catch {
      toast.error('Failed to save notification preferences.');
    }
  };

  const items = [
    {
      field: 'lowStockAlert',
      label: t('notifications.lowStockAlert'),
      description: t('notifications.lowStockDescription'),
      icon: 'fas fa-box-open',
    },
    {
      field: 'pushAlerts',
      label: t('notifications.pushAlerts'),
      description: t('notifications.pushDescription'),
      icon: 'fas fa-bell',
    },
    {
      field: 'emailAlerts',
      label: t('notifications.emailAlerts'),
      description: t('notifications.emailDescription'),
      icon: 'fas fa-envelope',
    },
    {
      field: 'smsAlerts',
      label: t('notifications.smsAlerts'),
      description: t('notifications.smsDescription'),
      icon: 'fas fa-sms',
    },
    {
      field: 'weeklySummary',
      label: t('notifications.weeklySummary'),
      description: t('notifications.weeklySummaryDescription'),
      icon: 'fas fa-calendar-week',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('notifications.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t('notifications.subtitle')}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 text-xs font-bold border border-emerald-500/20">
          <i className="fas fa-check-circle"></i>
          <span>{t('notifications.autoSaved')}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.field}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg shrink-0">
                  <i className={item.icon}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {notifications[item.field]
                    ? t('notifications.enabled')
                    : t('notifications.disabled')}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggle(item.field)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications[item.field] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      notifications[item.field] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            {t('notifications.saveButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsSettings;
