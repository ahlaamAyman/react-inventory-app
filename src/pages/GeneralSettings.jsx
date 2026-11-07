import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const GeneralSettings = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    storeName: 'Inventory Pro Hub',
    currency: 'USD ($)',
    lowStockThreshold: '5',
    receiptFooter: 'Thank you for shopping with us!',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('storeGeneralSettings');
      if (saved) setSettings(JSON.parse(saved));
    } catch {
      // fallback to initial
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('storeGeneralSettings', JSON.stringify(settings));
      toast.success(t('generalSettings.saved'));
    } catch {
      toast.error('Failed to save settings.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {t('generalSettings.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('generalSettings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('generalSettings.storeName')}
          </label>
          <input
            type="text"
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
            placeholder="e.g. Heliopolis Inventory Hub"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('generalSettings.currency')}
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="USD ($)">USD ($)</option>
            <option value="EGP (ج.م)">EGP (ج.م)</option>
            <option value="EUR (€)">EUR (€)</option>
            <option value="SAR (ر.س)">SAR (ر.س)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('generalSettings.lowStockThreshold')}
          </label>
          <input
            type="number"
            min="1"
            name="lowStockThreshold"
            value={settings.lowStockThreshold}
            onChange={handleChange}
            placeholder="5"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t('generalSettings.receiptFooter')}
          </label>
          <input
            type="text"
            name="receiptFooter"
            value={settings.receiptFooter}
            onChange={handleChange}
            placeholder="Thank you for shopping with us!"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition active:scale-95"
        >
          {t('generalSettings.saveButton')}
        </button>
      </div>
    </form>
  );
};

export default GeneralSettings;