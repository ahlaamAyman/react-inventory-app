import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const Growth = () => {
  const { items, salesHistory } = useSelector((state) => state.inventory);
  const [timeRange, setTimeRange] = useState('month');

  // Generate mock data for charts
  const generateSalesData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        name: `Week ${i + 1}`,
        sales: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 100) + 30,
        revenue: Math.floor(Math.random() * 8000) + 3000,
      });
    }
    return data;
  };

  const generateProductData = () => {
    return items.slice(0, 6).map((item, index) => ({
      name: item.title.substring(0, 15),
      sales: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  const generateTrendData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        name: `${i + 1}`,
        revenue: Math.floor(Math.random() * 6000) + 2000,
        profit: Math.floor(Math.random() * 3000) + 800,
        customers: Math.floor(Math.random() * 200) + 50,
      });
    }
    return data;
  };

  const salesData = generateSalesData();
  const productData = generateProductData();
  const trendData = generateTrendData();

  const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = salesHistory.length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const totalProducts = items.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Growth Analytics</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Track revenue, orders, and product performance metrics.</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: 'fa-dollar-sign', color: 'from-green-600 to-emerald-700' },
          { label: 'Total Orders', value: totalOrders, icon: 'fa-shopping-bag', color: 'from-indigo-600 to-purple-700' },
          { label: 'Avg Order Value', value: `$${averageOrderValue}`, icon: 'fa-chart-line', color: 'from-pink-600 to-rose-700' },
          { label: 'Total Products', value: totalProducts, icon: 'fa-boxes', color: 'from-orange-600 to-amber-700' },
        ].map((metric, index) => (
          <div key={index} className={`rounded-[2rem] bg-gradient-to-br ${metric.color} p-6 text-white shadow-xl overflow-hidden relative group`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-white/80">{metric.label}</p>
                  <p className="mt-3 text-4xl font-black">{metric.value}</p>
                </div>
                <div className="rounded-3xl bg-black/20 p-4">
                  <i className={`fas ${metric.icon} text-2xl`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sales Overview</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Weekly sales trend</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Product Performance</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Top selling products</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Trend</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monthly revenue progression</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Customer Growth</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Customer acquisition over time</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-opacity)" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Performance Summary</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Key insights and metrics for this period</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Growth Rate', value: '+23.5%', change: 'up' },
            { label: 'Conversion Rate', value: '4.2%', change: 'up' },
            { label: 'Churn Rate', value: '2.1%', change: 'down' },
          ].map((item, index) => (
            <div key={index} className="rounded-3xl bg-slate-50 dark:bg-slate-800 p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{item.value}</p>
                <span className={`text-sm font-semibold ${item.change === 'up' ? 'text-emerald-600' : 'text-slate-600'}`}>
                  <i className={`fas fa-arrow-${item.change}`}></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Growth;
