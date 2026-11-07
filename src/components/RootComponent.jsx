import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTranslation } from 'react-i18next';

const RootComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const navLinks = [
    { to: '/', label: t('nav.dashboard'), icon: 'fas fa-chart-pie' },
    { to: '/inventory', label: t('nav.inventory'), icon: 'fas fa-boxes' },
    { to: '/customers', label: t('nav.customers'), icon: 'fas fa-users' },
    { to: '/pos', label: t('nav.pos'), icon: 'fas fa-cash-register' },
    { to: '/history', label: t('nav.orders'), icon: 'fas fa-receipt' },
    { to: '/growth', label: t('nav.growth'), icon: 'fas fa-chart-line' },
    { to: '/settings', label: t('nav.settings'), icon: 'fas fa-cog' },
  ];

  // Derive header title dynamically based on current route
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/') return t('header.dashboard');
    if (path.startsWith('/inventory')) return t('header.inventory');
    if (path.startsWith('/customers')) return t('header.customers');
    if (path.startsWith('/pos')) return t('header.pos');
    if (path.startsWith('/history')) return t('header.orders');
    if (path.startsWith('/growth')) return t('header.growth');
    if (path.startsWith('/settings')) return t('header.settings');
    return t('appName');
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div
      className="flex min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Persistent, Mobile Collapsible Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 flex flex-col w-72 bg-slate-900 dark:bg-slate-900 border-e border-slate-800 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isRTL
            ? mobileMenuOpen
              ? 'translate-x-0'
              : 'translate-x-full lg:translate-x-0'
            : mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <i className="fas fa-cubes text-lg"></i>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wide">{t('appName')}</h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                {t('nav.version')}
              </span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close mobile menu"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <i className={`${item.icon} text-base w-5 text-center`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@store.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white text-sm font-bold transition-all border border-rose-500/20 active:scale-98"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button for mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 lg:hidden transition"
              aria-label="Open mobile navigation"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {getHeaderTitle()}
            </h2>
          </div>

          {/* Quick Actions (Dark mode, Language, Profile) */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-amber-400 transition"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <i className="fas fa-sun text-lg"></i> : <i className="fas fa-moon text-lg"></i>}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <label htmlFor="language-select" className="sr-only">
                {t('language.label')}
              </label>
              <select
                id="language-select"
                value={i18n.language}
                onChange={handleLanguageChange}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="en">{t('language.english')}</option>
                <option value="ar">{t('language.arabic')}</option>
              </select>
            </div>

            {/* User Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootComponent;
