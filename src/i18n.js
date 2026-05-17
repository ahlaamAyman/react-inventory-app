import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Inventory System',
      nav: {
        dashboard: 'Dashboard',
        inventory: 'Inventory',
        customers: 'Customers',
        pos: 'Sales (POS)',
        orders: 'Orders',
        growth: 'Growth',
        settings: 'Settings',
        logout: 'Logout',
        version: 'version 1.0',
      },
      header: {
        dashboard: 'Dashboard',
      },
      language: {
        label: 'Language',
        english: 'English',
        arabic: 'Arabic',
      },
    },
  },
  ar: {
    translation: {
      appName: 'نظام المخزون',
      nav: {
        dashboard: 'الرئيسية',
        inventory: 'المخزون',
        customers: 'العملاء',
        pos: 'المبيعات',
        orders: 'الطلبات',
        growth: 'النمو',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        version: 'الإصدار 1.0',
      },
      header: {
        dashboard: 'الرئيسية',
      },
      language: {
        label: 'اللغة',
        english: 'الإنجليزية',
        arabic: 'العربية',
      },
    },
  },
};

const savedLanguage = localStorage.getItem('appLanguage') || 'en';

const setDirection = (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  document.documentElement.dir = dir;
};

setDirection(savedLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
  setDirection(lng);
});

export default i18n;
