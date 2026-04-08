import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const RootComponent = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider">inventory system</h1>
        </div>
        <nav className="flex-1 mt-6 px-4 flex flex-col gap-2 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => {
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) => {
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            Inventory
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) => {
              `flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`;
            }}
          >
            Customers
          </NavLink>
        </nav>
        {/* ...........................sidebar..................... */}
      </aside>
      <div className="flex-1 flex flex-col">
        {/* ...........................navbar................. */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-8">
          <div className="text-gray-600 font-semibold text-lg">Dashboard</div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">version 1.0</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootComponent;
