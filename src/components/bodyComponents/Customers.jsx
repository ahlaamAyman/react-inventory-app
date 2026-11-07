import { useContext, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';

const Customers = () => {
  const { t } = useTranslation();
  const { customers, setCustomers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialCustomer = {
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialCustomer);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());

  // Search filter
  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return customers.filter(
      (c) =>
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term))
    );
  }, [customers, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (customer) => {
    setIsEditing(true);
    setCurrentId(customer.id);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      status: customer.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (customerId) => {
    const next = new Set(selectedCustomers);
    if (next.has(customerId)) {
      next.delete(customerId);
    } else {
      next.add(customerId);
    }
    setSelectedCustomers(next);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map((c) => c.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(t('customers.toast.confirmDeleteSelected'))) {
      setCustomers(customers.filter((c) => !selectedCustomers.has(c.id)));
      setSelectedCustomers(new Set());
      toast.success(t('customers.toast.deletedSelected'));
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm(t('customers.toast.confirmDelete'))) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      toast.success(t('customers.toast.deleted'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('customers.toast.nameRequired'));
      return;
    }

    if (formData.email && !formData.email.includes('@')) {
      toast.error(t('customers.toast.validEmail'));
      return;
    }

    if (isEditing) {
      setCustomers(
        customers.map((c) =>
          c.id === currentId ? { ...formData, id: currentId } : c
        )
      );
      toast.success(t('customers.toast.updated'));
    } else {
      const customerToAdd = {
        ...formData,
        id: Date.now(),
        ordersCount: 0,
      };
      setCustomers([...customers, customerToAdd]);
      toast.success(t('customers.toast.added'));
    }

    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData(initialCustomer);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              {t('customers.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {t('customers.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Search Box with Logical RTL Alignment */}
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder={t('customers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-10 pe-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setCurrentId(null);
              setFormData(initialCustomer);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95 shrink-0"
          >
            <i className="fas fa-user-plus text-xs"></i>
            <span>{t('customers.addCustomer')}</span>
          </button>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir="auto">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-center w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.size === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                  {t('customers.table.customer')}
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                  {t('customers.table.email')}
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                  {t('customers.table.phone')}
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                  {t('customers.table.status')}
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-end">
                  {t('customers.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer.id)}
                        onChange={() => handleCheckboxChange(customer.id)}
                        className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 text-start">
                      {customer.email || '---'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 font-medium text-start">
                      {customer.phone || '---'}
                    </td>
                    <td className="px-6 py-4 text-xs text-start">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                          customer.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {customer.status === 'Active'
                          ? t('common.active')
                          : t('common.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(customer)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition"
                          title={t('common.edit')}
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomer(customer.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition"
                          title={t('common.delete')}
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    <i className="fas fa-user-slash text-4xl mb-2 block"></i>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {t('customers.noCustomers')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & bulk action */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            {t('customers.showing')} {filteredCustomers.length} {t('customers.of')} {customers.length} {t('customers.title')}
          </span>
          {selectedCustomers.size > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow"
            >
              <i className="fas fa-trash-alt me-1.5"></i>
              {t('customers.deleteSelected')} ({selectedCustomers.size})
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {isEditing ? t('customers.editCustomer') : t('customers.addCustomer')}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  {t('customers.form.name')}
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('customers.form.namePlaceholder')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  {t('customers.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('customers.form.emailPlaceholder')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  {t('customers.form.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('customers.form.phonePlaceholder')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  {t('customers.form.status')}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Active">{t('common.active')}</option>
                  <option value="Inactive">{t('common.inactive')}</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  {t('customers.form.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  {isEditing ? t('customers.form.update') : t('customers.form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
