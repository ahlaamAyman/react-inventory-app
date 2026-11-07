import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { exportToExcel } from '../utils/exportUtils';

const orderStatusClasses = {
  Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  Cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
};

const SalesHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { salesHistory } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders by search and status
  const filteredOrders = useMemo(() => {
    return salesHistory.filter((order) => {
      const orderRef = order.orderRef || `#${String(order.id).slice(-6)}`;
      const customer = order.customerName || t('pos.walkInCustomer');
      const term = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !term ||
        orderRef.toLowerCase().includes(term) ||
        customer.toLowerCase().includes(term);

      const status = order.status || 'Completed';
      const matchesStatus = statusFilter === 'All' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [salesHistory, searchTerm, statusFilter, t]);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderModal = () => setSelectedOrder(null);

  const handleExportOrders = () => {
    if (salesHistory.length === 0) {
      toast.error(t('orders.toast.exportEmpty'));
      return;
    }

    const exportData = filteredOrders.map((sale) => ({
      OrderID: sale.id,
      Reference: sale.orderRef || `#${String(sale.id).slice(-6)}`,
      Customer: sale.customerName || t('pos.walkInCustomer'),
      Date: sale.date || '---',
      ItemsCount: sale.items?.length || 0,
      Total: `$${Number(sale.total).toFixed(2)}`,
      Status: sale.status || 'Completed',
    }));

    exportToExcel(exportData, 'Store_Orders_Sales_Report');
    toast.success(t('orders.toast.exportSuccess'));
  };

  const statusOptions = [
    { id: 'All', label: t('orders.all') },
    { id: 'Completed', label: t('orders.completed') },
    { id: 'Pending', label: t('orders.pending') },
    { id: 'Cancelled', label: t('orders.cancelled') },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('orders.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('orders.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportOrders}
            disabled={salesHistory.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-excel"></i>
            <span>{t('orders.exportOrders')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <i className="fas fa-plus"></i>
            <span>{t('orders.newSale')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <i className="fas fa-search absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder={t('orders.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-11 pe-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent focus:border-indigo-500"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setStatusFilter(status.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === status.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir="auto">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                    {t('orders.table.ref')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                    {t('orders.table.customer')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                    {t('orders.table.dateTime')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">
                    {t('orders.table.items')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                    {t('orders.table.total')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-start">
                    {t('orders.table.status')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-end">
                    {t('orders.table.action')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => {
                  const ref = order.orderRef || `#${String(order.id).slice(-6)}`;
                  const status = order.status || 'Completed';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-4 text-xs font-black text-slate-900 dark:text-white text-start">
                        {ref}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 text-start">
                        {order.customerName || t('pos.walkInCustomer')}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 text-start">
                        {order.date || '---'}
                      </td>
                      <td className="px-6 py-4 text-xs text-center font-bold text-slate-700 dark:text-slate-300">
                        {order.items?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-indigo-600 dark:text-indigo-400 text-start">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-xs text-start">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            orderStatusClasses[status] || orderStatusClasses.Completed
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-end">
                        <button
                          type="button"
                          onClick={() => viewOrderDetails(order)}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-bold transition text-slate-700 dark:text-slate-200"
                        >
                          {t('orders.table.receipt')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <i className="fas fa-receipt text-4xl mb-3 block"></i>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              {t('orders.noOrders')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t('orders.noOrdersSub')}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('orders.modal.title')}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedOrder.orderRef || `#${String(selectedOrder.id).slice(-6)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeOrderModal}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {t('orders.modal.customer')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedOrder.customerName || t('pos.walkInCustomer')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {t('orders.modal.status')}
                  </span>
                  <span className="font-bold text-emerald-500">
                    {selectedOrder.status || 'Completed'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto space-y-2 custom-scrollbar">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.qty} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${(item.qty * Number(item.price)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">
                  {t('orders.modal.totalPaid')}
                </span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  ${Number(selectedOrder.total).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={closeOrderModal}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                {t('orders.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;