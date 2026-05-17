import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/exportUtils';

const orderStatusClasses = {
  Completed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const SalesHistory = () => {
  const navigate = useNavigate();
  const { salesHistory } = useSelector((state) => state.inventory);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const viewOrderDetails = (orderId) => {
    const order = salesHistory.find((sale) => sale.id === orderId);
    setSelectedOrder(order || null);
  };

  const closeOrderModal = () => setSelectedOrder(null);

  const handleNewOrder = () => {
    navigate('/pos');
  };

  const handleExportOrders = () => {
    if (!salesHistory || salesHistory.length === 0) return;
    const exportData = salesHistory.map((sale, index) => ({
      OrderID: sale.id,
      OrderRef: `#${sale.id.toString().slice(-5)}`,
      Customer: sale.customerName || `Customer ${index + 1}`,
      Date: sale.time || '---',
      Items: sale.items.length,
      Total: sale.total,
      Status:
        index % 3 === 0
          ? 'Completed'
          : index % 3 === 1
          ? 'Pending'
          : 'Cancelled',
    }));
    exportToExcel(exportData, 'Orders_Report');
  };

  const orders = salesHistory.map((sale, index) => ({
    id: sale.id,
    orderRef: `#${sale.id.toString().slice(-5)}`,
    customer: sale.customerName || `Customer ${index + 1}`,
    date: sale.time || '---',
    total: sale.total,
    items: sale.items.length,
    status:
      index % 3 === 0
        ? 'Completed'
        : index % 3 === 1
        ? 'Pending'
        : 'Cancelled',
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Orders</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Review an order log that matches your dashboard style.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportOrders}
            disabled={salesHistory.length === 0}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <i className="fas fa-download text-sm"></i>
            Export Orders
          </button>
          <button
            onClick={handleNewOrder}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <i className="fas fa-plus text-sm"></i>
            New Order
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 p-6 border-b border-slate-100 dark:border-slate-700 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sorted by latest orders for quick review.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition">Filter</button>
            <button className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition">Search</button>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Order</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Items</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'}>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-900 dark:text-white">{order.orderRef}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{order.customer}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{order.date}</td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{order.items}</td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-900 dark:text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${orderStatusClasses[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg font-semibold mb-3">No orders available yet.</p>
            <p>Add a sale from the POS page to start seeing orders here.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-3xl rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Order Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{`Order ${selectedOrder.id.toString().slice(-5)}`}</p>
              </div>
              <button
                onClick={closeOrderModal}
                className="rounded-full p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label="Close order details"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order ref</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">#{selectedOrder.id.toString().slice(-5)}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                  <p className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClasses[selectedOrder.id % 3 === 0 ? 'Completed' : selectedOrder.id % 3 === 1 ? 'Pending' : 'Cancelled']}`}>
                    {selectedOrder.id % 3 === 0 ? 'Completed' : selectedOrder.id % 3 === 1 ? 'Pending' : 'Cancelled'}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{selectedOrder.time || '---'}</p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-50 dark:bg-slate-900 p-6">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Items</h4>
                <div className="mt-4 space-y-4">
                  {selectedOrder.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.title || item.name || 'Product'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.qty || item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                        <p className="font-semibold text-slate-900 dark:text-white">${(item.price || item.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;