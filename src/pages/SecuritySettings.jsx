import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const SecuritySettings = () => {
  const { t } = useTranslation();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdate = (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 6) {
      toast.error(t('securitySettings.minChars'));
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(t('securitySettings.mismatch'));
      return;
    }

    // Verify against registered user if present
    let registeredUser = null;
    try {
      const raw = localStorage.getItem('registeredUser');
      if (raw) registeredUser = JSON.parse(raw);
    } catch {
      registeredUser = null;
    }

    if (registeredUser && passwords.currentPassword !== registeredUser.password) {
      toast.error(t('securitySettings.currentWrong'));
      return;
    }

    // Update stored password
    if (registeredUser) {
      registeredUser.password = passwords.newPassword;
      localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
    }

    toast.success(t('securitySettings.saved'));
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('securitySettings.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('securitySettings.subtitle')}
          </p>
        </div>
        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
          <i className="fas fa-shield-alt"></i>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('securitySettings.currentPassword')}
          </label>
          <input
            required
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500 transition"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('securitySettings.newPassword')}
          </label>
          <input
            required
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Min 6 characters"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('securitySettings.confirmPassword')}
          </label>
          <input
            required
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Re-enter new password"
          />
        </div>

        <div className="md:col-span-2 pt-6 flex justify-end border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            {t('securitySettings.saveButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;