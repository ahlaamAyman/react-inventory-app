import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useTranslation } from "react-i18next";

const RootComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }

    const handleLanguageChange = (event) => {
      i18n.changeLanguage(event.target.value);
    };



  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl dark:bg-gray-800">
        <div className="p-6 text-center border-b border-slate-800 dark:border-gray-700">
          <h1 className="text-xl font-bold tracking-wider">{t('appName')}</h1>
        </div>
        <nav className="flex-1 mt-6 px-4 flex flex-col gap-2 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.dashboard')}
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.inventory')}
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.customers')}
          </NavLink>
          <NavLink
            to="/pos"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.pos')}
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
           {t('nav.orders')}
          </NavLink>

          <NavLink
            to="/growth"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.growth')}
          </NavLink>

           <NavLink
            to="/settings"
            className={({ isActive }) => {
              return `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            {t('nav.settings')}
          </NavLink>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 dark:border-gray-700 bg-slate-900/50">
          <button 
             onClick={handleLogout}
             className="group flex items-center justify-center gap-3 w-full py-3 rounded-xl 
               bg-gradient-to-r from-red-600/20 to-red-900/20 
               hover:from-red-600 hover:to-red-700 
               text-red-500 hover:text-white 
               transition-all duration-500 font-bold border border-red-500/10 hover:border-red-500"
            >
             <i className="fas fa-sign-out-alt group-hover:scale-110 transition-transform"></i>
              <span>{t('nav.logout')}</span>
          </button>

        </div>


        {/* ...........................sidebar..................... */}
      </aside>
      <div className="flex-1 flex flex-col">
        {/* ...........................navbar................. */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-8 dark:bg-gray-800 dark:border-b dark:border-gray-700">
          <div className="text-gray-600 font-semibold text-lg dark:text-white">Dashboard</div>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => toggleDarkMode()} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer bg-yellow-400 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <i className="fas fa-sun text-white text-lg"></i> : <i className="fas fa-moon text-gray-800 text-lg"></i>}
            </button>
            <label htmlFor="language-switcher" className="sr-only">{t('language.label')}</label>
            <select
              id="language-switcher"
              value={i18n.language}
              onChange={handleLanguageChange}
              className="rounded-xl border border-slate-300 bg-white text-sm text-slate-700 px-3 py-2 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="en">{t('language.english')}</option>
              <option value="ar">{t('language.arabic')}</option>
            </select>
            <span className="text-sm text-gray-400 dark:text-gray-500">{t('nav.version')}</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootComponent;
