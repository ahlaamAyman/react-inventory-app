import React from 'react';
import toast from 'react-hot-toast';

const GeneralSettings = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-black dark:text-white leading-none">Store Information</h2>
        <p className="text-sm text-gray-400 mt-2 font-medium">Customize how your store appears to you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Store Display Name</label>
          <input 
            type="text" 
            placeholder="Heliopolis Inventory" 
            className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner" 
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Default Currency</label>
          <select className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold shadow-inner cursor-pointer">
            <option>EGP (ج.م)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Low Stock Threshold</label>
          <input 
            type="number" 
            placeholder="5" 
            className="w-full p-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-700 border-none dark:text-white focus:ring-2 focus:ring-amber-500 font-bold shadow-inner" 
          />
        </div>
      </div>

      <div className="pt-8 border-t dark:border-gray-700 flex justify-end">
        <button 
          onClick={() => toast.success('General settings saved!')}
          className="px-12 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;