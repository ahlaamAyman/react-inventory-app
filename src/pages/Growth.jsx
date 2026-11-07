import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const Growth = () => {
  const { t, i18n } = useTranslation();
  const { darkMode } = useTheme();
  const { items, salesHistory } = useSelector((state) => state.inventory);
  const [timeRange, setTimeRange] = useState('month');

  // Key performance calculations from actual Redux data
  const totalRevenue = useMemo(() => {
    return salesHistory.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
  }, [salesHistory]);

  const totalOrders = salesHistory.length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';
  const totalProducts = items.length;

  // Memoized deterministic sales charts based on selected timeRange
  const salesData = useMemo(() => {
    const isAr = i18n.language === 'ar';
    if (timeRange === 'week') {
      return [
        { name: isAr ? 'الإثنين' : 'Mon', sales: 1200, orders: 14, revenue: 1600 },
        { name: isAr ? 'الثلاثاء' : 'Tue', sales: 1900, orders: 22, revenue: 2300 },
        { name: isAr ? 'الأربعاء' : 'Wed', sales: 1400, orders: 17, revenue: 1800 },
        { name: isAr ? 'الخميس' : 'Thu', sales: 2100, orders: 28, revenue: 2700 },
        { name: isAr ? 'الجمعة' : 'Fri', sales: 2800, orders: 35, revenue: 3400 },
        { name: isAr ? 'السبت' : 'Sat', sales: 2400, orders: 30, revenue: 3100 },
        { name: isAr ? 'الأحد' : 'Sun', sales: 1700, orders: 20, revenue: 2100 },
      ];
    }
    if (timeRange === 'year') {
      return [
        { name: isAr ? 'الربع 1' : 'Q1', sales: 18000, orders: 210, revenue: 24000 },
        { name: isAr ? 'الربع 2' : 'Q2', sales: 24000, orders: 310, revenue: 32000 },
        { name: isAr ? 'الربع 3' : 'Q3', sales: 29000, orders: 380, revenue: 39000 },
        { name: isAr ? 'الربع 4' : 'Q4', sales: 36000, orders: 490, revenue: 48000 },
      ];
    }
    // Default: 'month'
    return [
      { name: isAr ? 'الأسبوع 1' : 'Week 1', sales: 3200, orders: 42, revenue: 4100 },
      { name: isAr ? 'الأسبوع 2' : 'Week 2', sales: 4500, orders: 58, revenue: 5600 },
      { name: isAr ? 'الأسبوع 3' : 'Week 3', sales: 3900, orders: 51, revenue: 4900 },
      { name: isAr ? 'الأسبوع 4' : 'Week 4', sales: 5200, orders: 67, revenue: 6400 },
    ];
  }, [timeRange, i18n.language]);

  // Product performance chart data derived from real items
  const productData = useMemo(() => {
    return items.slice(0, 6).map((item) => ({
      name: item.title.length > 12 ? `${item.title.substring(0, 12)}...` : item.title,
      units: Number(item.stock) || 0,
      valuation: (Number(item.price || 0) * Number(item.stock || 0)).toFixed(0),
    }));
  }, [items]);

  // Revenue & Profit progression
  const trendData = useMemo(() => {
    const isAr = i18n.language === 'ar';
    return [
      { name: isAr ? 'يناير' : 'Jan', revenue: 4200, profit: 2100 },
      { name: isAr ? 'فبراير' : 'Feb', revenue: 5100, profit: 2600 },
      { name: isAr ? 'مارس' : 'Mar', revenue: 6300, profit: 3200 },
      { name: isAr ? 'أبريل' : 'Apr', revenue: 5800, profit: 2900 },
      { name: isAr ? 'مايو' : 'May', revenue: 7400, profit: 3900 },
      { name: isAr ? 'يونيو' : 'Jun', revenue: 8600, profit: 4600 },
    ];
  }, [i18n.language]);

  const ranges = [
    { id: 'week', label: t('growth.week') },
    { id: 'month', label: t('growth.month') },
    { id: 'year', label: t('growth.year') },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Time Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('growth.title')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('growth.subtitle')}
          </p>
        </div>

        {/* Time Range Chips */}
        <div className="flex gap-2">
          {ranges.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setTimeRange(range.id)}
              className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition uppercase tracking-wider ${
                timeRange === range.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-100">
              {t('growth.kpi.revenue')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
              <i className="fas fa-dollar-sign text-lg"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-emerald-100/80 mt-1">{t('growth.kpi.revenueSub')}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-100">
              {t('growth.kpi.orders')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
              <i className="fas fa-shopping-bag text-lg"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black">{totalOrders}</p>
            <p className="text-xs text-indigo-100/80 mt-1">{t('growth.kpi.ordersSub')}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-gradient-to-br from-rose-600 to-pink-700 p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-100">
              {t('growth.kpi.avg')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
              <i className="fas fa-chart-line text-lg"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black">${averageOrderValue}</p>
            <p className="text-xs text-rose-100/80 mt-1">{t('growth.kpi.avgSub')}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-orange-700 p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-100">
              {t('growth.kpi.skus')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
              <i className="fas fa-boxes text-lg"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black">{totalProducts}</p>
            <p className="text-xs text-amber-100/80 mt-1">{t('growth.kpi.skusSub')}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('growth.salesVelocity')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{t('growth.salesVelocitySub')}</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              {timeRange}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
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
                <Bar dataKey="sales" name={t('dashboard.sales')} fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Stock Chart */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('growth.skuVolume')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{t('growth.skuVolumeSub')}</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
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
                <Bar dataKey="units" name={t('common.stock')} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Profit Line Chart */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('growth.revenueVsProfit')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{t('growth.revenueVsProfitSub')}</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                <Legend />
                <Line type="monotone" dataKey="revenue" name={t('growth.kpi.revenue')} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="profit" name={t('dashboard.profit')} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Insights Summary */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('growth.storeHealth')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{t('growth.storeHealthSub')}</p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: t('growth.metrics.turnover'),
                value: '4.8x',
                note: t('growth.metrics.turnoverNote'),
                color: 'text-emerald-500',
              },
              {
                label: t('growth.metrics.margin'),
                value: '62.4%',
                note: t('growth.metrics.marginNote'),
                color: 'text-indigo-500',
              },
              {
                label: t('growth.metrics.risk'),
                value: `${items.filter((i) => i.stock === 0).length} SKUs`,
                note: t('growth.metrics.riskNote'),
                color: 'text-rose-500',
              },
            ].map((insight, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{insight.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{insight.note}</p>
                </div>
                <span className={`text-lg font-black ${insight.color}`}>{insight.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Growth;
