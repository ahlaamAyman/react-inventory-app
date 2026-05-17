import React, { useEffect } from "react";
import { loadData } from "../../utils/localStorageUtils";
import { useTheme } from "../../context/ThemeContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useSelector } from "react-redux";
import { exportToExcel } from "../../utils/exportUtils";
import { selectInventoryValue, selectLowStockProducts, selectTotalProducts, selectTotalStock } from "../../store/inventorySlice";

const Dashboard = () => {
  const totalProducts = useSelector(selectTotalProducts);
  const totalValue = useSelector(selectInventoryValue);
  const totalStock = useSelector(selectTotalStock);
  const { darkMode } = useTheme();
  const items = useSelector((state) => state.inventory.items);
  const lowStockItems = useSelector(selectLowStockProducts);
  const customers = useSelector((state) => state.customers || []);

  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
  });

  const [salesTrend, setSalesTrend] = React.useState([
    { name: 'Mon', sales: 160, profit: 120 },
    { name: 'Tue', sales: 190, profit: 150 },
    { name: 'Wed', sales: 140, profit: 110 },
    { name: 'Thu', sales: 210, profit: 180 },
    { name: 'Fri', sales: 230, profit: 200 },
    { name: 'Sat', sales: 180, profit: 140 },
    { name: 'Sun', sales: 200, profit: 170 },
  ]);

  const [categoryData, setCategoryData] = React.useState([]);
  const [topProducts, setTopProducts] = React.useState([]);

  const handleExportReport = () => {
    const reportData = [
      { Metric: 'Total Products', Value: totalProducts },
      { Metric: 'Inventory Value', Value: totalValue },
      { Metric: 'Items In Stock', Value: totalStock },
      { Metric: 'Total Customers', Value: customers.length },
      { Metric: 'Active Customers', Value: stats.activeCustomers },
      { Metric: 'Total Orders', Value: stats.totalOrders },
    ];
    exportToExcel(reportData, 'Dashboard_Report');
  };

  useEffect(() => {
    const loadedCustomers = loadData('my-customers') || [];
    const activeCustomers = loadedCustomers.filter((c) => c.status === 'Active').length;
    const totalOrders = loadedCustomers.reduce((sum, c) => sum + (c.ordersCount || 1), 0);

    const categoryMap = items.reduce((acc, item) => {
      if (!item.category) return acc;
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const top = [...items]
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.title,
        quantity: item.stock || 0,
        price: item.price || 0,
        amount: ((item.price || 0) * (item.stock || 0)).toFixed(0),
      }));

    setStats({
      totalProducts: items.length,
      totalCustomers: loadedCustomers.length,
      activeCustomers,
      totalOrders,
    });
    setCategoryData(categories.length ? categories : [{ name: 'Other', value: 1 }]);
    setTopProducts(top);
  }, [items]);

  const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#0EA5E9', '#A855F7', '#EC4899'];

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Overview of recent business activity and inventory performance.</p>
        </div>
        <button onClick={handleExportReport} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-semibold shadow-lg shadow-blue-500/10 transition-all">
          <i className="fas fa-download"></i>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="text-slate-700 dark:text-slate-200 font-semibold">Products</div>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
              <i className="fas fa-box-open"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalProducts}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">All products currently in inventory</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="text-slate-700 dark:text-slate-200 font-semibold">Shipped</div>
            <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-300">
              <i className="fas fa-truck"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalOrders}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">Orders processed this week</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="text-slate-700 dark:text-slate-200 font-semibold">Delivered</div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.activeCustomers}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">Active customers served</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="text-slate-700 dark:text-slate-200 font-semibold">Invoices</div>
            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{customers.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">Total customer invoices</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Revenue and profit performance during the last week.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Sales
              <span className="w-2 h-2 rounded-full bg-cyan-500 ml-3"></span> Profit
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity)" />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Distribution</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Category share from inventory.</p>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={60} fill="#4F46E5">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={56} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Growth</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customer acquisition and activity trends.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">New Customers</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{stats.totalCustomers}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Active Customers</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{stats.activeCustomers}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Inventory Value</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-900 p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip />
                <Bar dataKey="sales" fill="#4F46E5" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Selling Products</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Most stocked items in your inventory.</p>
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qty {product.quantity} • ${product.price}</p>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">${product.amount}</p>
              </div>
            )) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-10">No products available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
