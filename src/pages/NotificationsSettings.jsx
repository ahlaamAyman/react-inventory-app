import React, { useState } from 'react';
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

  const handleToggle = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success(t('notifications.saved'));
  };

  const items = [
    {
      label: t('notifications.emailAlerts'),
      description: t('notifications.emailDescription'),
      field: 'emailAlerts',
      icon: 'fas fa-envelope',
    },
    {
      label: t('notifications.smsAlerts'),
      description: t('notifications.smsDescription'),
      field: 'smsAlerts',
      icon: 'fas fa-sms',
    },
    {
      label: t('notifications.pushAlerts'),
      description: t('notifications.pushDescription'),
      field: 'pushAlerts',
      icon: 'fas fa-bell',
    },
    {
      label: t('notifications.lowStockAlert'),
      description: t('notifications.lowStockDescription'),
      field: 'lowStockAlert',
      icon: 'fas fa-box-open',
    },
    {
      label: t('notifications.weeklySummary'),
      description: t('notifications.weeklySummaryDescription'),
      field: 'weeklySummary',
      icon: 'fas fa-calendar-week',
    },
  ];

  return (
    <div dir="rtl" className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black dark:text-white leading-tight">إعدادات الإشعارات</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-2xl">
            اختر طرق التواصل التي تريد استقبال التنبيهات من خلالها، سواء لمخزون المنتجات أو التحديثات العامة.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200 px-5 py-3 text-sm font-semibold shadow-sm border border-emerald-200 dark:border-emerald-700/50">
          <i className="fas fa-check-circle"></i>
          يتم حفظ التعديلات تلقائياً في العرض
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.field}
              className="group rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm">
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{item.label}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.18em] ${
                    notifications[item.field]
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200'
                      : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                  }`}
                >
                  {notifications[item.field] ? 'مفعل' : 'معطل'}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.field)}
                    className={`relative inline-flex h-11 w-20 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${
                      notifications[item.field] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    aria-label={notifications[item.field] ? 'إيقاف التنبيه' : 'تفعيل التنبيه'}
                  >
                    <span
                      className={`inline-block h-9 w-9 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        notifications[item.field] ? 'translate-x-9' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-bold text-slate-700 dark:text-gray-300">تبديل</span>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">الحد الأعلى</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">ملاحظات إضافية</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                يمكن تعديل إعدادات التنبيه لاحقاً في أي وقت من لوحة الإعدادات، وسيظل تنبيه المخزون يعمل بشكل تلقائي.
              </p>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center rounded-[1.5rem] bg-indigo-600 px-10 py-4 text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
            >
              حفظ الإعدادات
            </button>
          </div>
        </div>
      </form>
    
    </div>
  );
};

export default NotificationsSettings;
