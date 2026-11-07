import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
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
import { useTheme } from '../../context/ThemeContext';
import { AppContext } from '../../context/AppContext';
import { exportToExcel } from '../../utils/exportUtils';
import {
  selectInventoryValue,
  selectLowStockProducts,
  selectTotalProducts,
  selectTotalStock,
} from '../../store/inventorySlice';
import LowStockTable from '../dashboard/LowStockTable';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { darkMode } = useTheme();
  const { customers } = useContext(AppContext);

  const totalProducts = useSelector(selectTotalProducts);
  const totalValue = useSelector(selectInventoryValue);
  const totalStock = useSelector(selectTotalStock);
  const lowStockItems = useSelector(selectLowStockProducts);
  const items = useSelector((state) => state.inventory.items);
  const salesHistory = useSelector((state) => state.inventory.salesHistory);

  // Derive weekly revenue/sales trends
  const salesTrend = useMemo(() => {
    const isAr = i18n.language === 'ar';
    return [
      { name: isAr ? 'الإثنين' : 'Mon', sales: 160, profit: 120 },
      { name: isAr ? 'الثلاثاء' : 'Tue', sales: 190, profit: 150 },
      { name: isAr ? 'الأربعاء' : 'Wed', sales: 140, profit: 110 },
      { name: isAr ? 'الخميس' : 'Thu', sales: 210, profit: 180 },
      { name: isAr ? 'الجمعة' : 'Fri', sales: 230, profit: 200 },
      { name: isAr ? 'السبت' : 'Sat', sales: 180, profit: 140 },
      { name: isAr ? 'الأحد' : 'Sun', sales: 200, profit: 170 },
    ];
  }, [i18n.language]);

  // Category Distribution from actual inventory items
  const categoryData = useMemo(() => {
    const categoryMap = items.reduce((acc, item) => {
      const cat = item.category || 'General';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    return entries.length ? entries : [{ name: 'General', value: 1 }];
  }, [items]);

  // Top stocked products
  const topProducts = useMemo(() => {
    return [...items]
      .sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0))
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.title,
        quantity: item.stock || 0,
        price: item.price || 0,
        amount: ((Number(item.price) || 0) * (Number(item.stock) || 0)).toFixed(2),
      }));
  }, [items]);

  const activeCustomersCount = useMemo(() => {
    return customers.filter((c) => c.status === 'Active').length;
  }, [customers]);

  const handleExportReport = () => {
    const reportData = [
      { Metric: t('dashboard.kpi.products'), Value: totalProducts },
      { Metric: t('dashboard.kpi.productsSub'), Value: totalStock },
      { Metric: t('dashboard.kpi.valuation'), Value: `$${totalValue.toLocaleString()}` },
      { Metric: t('lowStock.title'), Value: lowStockItems.length },
      { Metric: t('dashboard.kpi.customers'), Value: customers.length },
      { Metric: t('dashboard.kpi.customersSub'), Value: activeCustomersCount },
      { Metric: t('dashboard.kpi.orders'), Value: salesHistory.length },
    ];
    exportToExcel(reportData, 'Comprehensive_Dashboard_KPI_Report');
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & KPI Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition active:scale-95"
        >
          <i className="fas fa-file-download"></i>
          <span>{t('common.exportReport')}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Products KPI */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.kpi.products')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              <i className="fas fa-boxes"></i>
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{totalProducts}</div>
            <p className="text-xs text-slate-400 mt-1">
              {totalStock} {t('dashboard.kpi.productsSub')}
            </p>
          </div>
        </div>

        {/* Valuation KPI */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.kpi.valuation')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.kpi.valuationSub')}</p>
          </div>
        </div>

        {/* Orders KPI */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.kpi.orders')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
              <i className="fas fa-receipt"></i>
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{salesHistory.length}</div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.kpi.ordersSub')}</p>
          </div>
        </div>

        {/* Customers KPI */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.kpi.customers')}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{customers.length}</div>
            <p className="text-xs text-slate-400 mt-1">
              {activeCustomersCount} {t('dashboard.kpi.customersSub')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Profit Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('dashboard.salesOverview')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.salesOverviewSub')}</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> {t('dashboard.sales')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> {t('dashboard.profit')}
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} textAnchor="middle" />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                  }}
                />
                <Line type="monotone" dataKey="sales" name={t('dashboard.sales')} stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profit" name={t('dashboard.profit')} stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('dashboard.categoryDistribution')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.categoryDistributionSub')}</p>
          </div>

          <div className="h-72 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={4}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Low Stock Alert Table + Top Stocked Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrated Low Stock Alerts Component */}
        <LowStockTable items={lowStockItems} />

        {/* Top Stocked Items */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboard.topProducts')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{t('dashboard.topProductsSub')}</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {t('dashboard.top5')}
            </span>
          </div>

          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.quantity} {t('dashboard.units')} · ${p.price} {t('dashboard.each')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      ${p.amount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">{t('dashboard.noProducts')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
