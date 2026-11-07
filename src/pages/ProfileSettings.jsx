import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { updateUserProfile } from '../store/authSlice';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState({
    name: user?.name || 'Store Administrator',
    email: user?.email || 'admin@store.com',
    phone: user?.phone || '01007080342',
    role: user?.role || 'Store Manager',
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        role: user.role || prev.role,
      }));
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Full name is required.');
      return;
    }
    dispatch(updateUserProfile(profile));
    toast.success(t('profileSettings.saved'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t('profileSettings.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('profileSettings.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Display */}
        <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 w-fit">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-600/20">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{profile.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {t('profileSettings.fullName')}
            </label>
            <input
              required
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {t('profileSettings.email')}
            </label>
            <input
              required
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {t('profileSettings.phone')}
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {t('profileSettings.role')}
            </label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs sm:text-sm font-bold cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition active:scale-95"
          >
            {t('profileSettings.saveButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;