import React, { useContext, useEffect } from "react";
import { loadData, saveData } from "../../utils/localStorageUtils";
import { useTheme } from "../../context/ThemeContext";
import { AppContext } from "../../context/AppContext";
const Customers = () => {
  const { darkMode } = useTheme();
  const{customers, setCustomers} = useContext(AppContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const[isEditing, setIsEditing] = React.useState(false);
  const[currentId, setCurrentId] = React.useState(null);
  const [newCustomer, setNewCustomer] = React.useState({
    name: "",
    email: "",
    phone: "",
    status: "Active"
  });
  const [selectedCustomers, setSelectedCustomers] = React.useState(new Set());

  useEffect(()=>{
    const saved=loadData('my-customers');
    if(saved)      setCustomers(saved);
  },[])


  useEffect(()=>{
saveData('my-customers', customers);

  },[customers])


  const handleChange = (e)=>{
    const {name, value} = e.target;
    setNewCustomer(prev => ({...prev, [name]: value}));
  };

  const handleEditClick = (customer)=>{
    setIsEditing(true);
    setCurrentId(customer.id);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    });
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (customerId) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)));
    }
  };

  const handleDeleteSelected = () => {
    const updatedCustomers = customers.filter(c => !selectedCustomers.has(c.id));
    setCustomers(updatedCustomers);
    setSelectedCustomers(new Set());
  };


  const handleSubmit = (e)=>{
    e.preventDefault();
    if(isEditing){
      const updatedCustomers = customers.map(c => 
        c.id === currentId ? {...newCustomer, id: currentId} : c
      );
      setCustomers(updatedCustomers);
    } else {
      const customerToAdd={...newCustomer, id: Date.now()};
      setCustomers([...customers, customerToAdd]);
    }
    setIsModalOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      status: "Active"
    })
  };



  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const deleteCustomer = (id)=>{
      setCustomers(customers.filter(customer => customer.id !== id));
    }

    return (
  <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-6 animate-in fade-in duration-500">
    
    {/* --- Header Section --- */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <i className="fas fa-users text-2xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Customers</h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">Manage your customer database and orders</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-80 group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-gray-100 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-sm font-medium"
          />
        </div>

        <button 
          onClick={() => {
            setIsEditing(false);
            setCurrentId(null);
            setNewCustomer({
              name: "",
              email: "",
              phone: "",
              status: "Active"
            });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
        >
          <i className="fas fa-plus text-xs"></i>
          <span>Add New Customer</span>
        </button>
      </div>
    </div>

    <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-slate-700/30 border-b dark:border-gray-700">
              <th className="px-6 py-4 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">ID</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {filteredCustomers?.length > 0 ? filteredCustomers.map((customer, index) => (
              <tr key={customer.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all">
                <td className="px-6 py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedCustomers.has(customer.id)}
                    onChange={() => handleCheckboxChange(customer.id)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                </td>
                <td className="px-8 py-5 text-sm font-bold text-gray-400">#{(index + 1).toString().padStart(2, '0')}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shadow-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 transition-colors">{customer.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-300">
                  {customer.email}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight">
                  {customer.phone}
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black ${customer.status === 'Active' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEditClick(customer)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button 
                      onClick={() => deleteCustomer(customer.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <i className="fas fa-user-slash text-5xl"></i>
                    <p className="text-sm font-bold uppercase tracking-widest">No customers found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-8 py-5 bg-gray-50/50 dark:bg-slate-700/20 border-t dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredCustomers?.length} Results
          </span>
          {selectedCustomers.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-lg transition-all"
            >
              <i className="fas fa-trash mr-2"></i>
              Delete Selected ({selectedCustomers.size})
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition-all"><i className="fas fa-chevron-left text-xs"></i></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 transition-all"><i className="fas fa-chevron-right text-xs"></i></button>
        </div>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-white/20 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black dark:text-white leading-none tracking-tight">
              {isEditing ? 'Edit Customer' : 'Create Customer'}
            </h2>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setIsEditing(false);
                setCurrentId(null);
                setNewCustomer({
                  name: "",
                  email: "",
                  phone: "",
                  status: "Active"
                });
              }} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
              <input 
                required
                type="text" 
                name="name"
                placeholder="Ex: Ahmed Mohamed"
                value={newCustomer.name}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-none bg-gray-100 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-inner font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
              <input 
                required
                type="email" 
                name="email"
                placeholder="email@example.com"
                value={newCustomer.email}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-none bg-gray-100 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-inner font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
              <input 
                required
                type="tel" 
                name="phone"
                placeholder="01xxxxxxxxx"
                value={newCustomer.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-none bg-gray-100 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-inner font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4">Status</label>
              <select 
                name="status"
                value={newCustomer.status}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border-none bg-gray-100 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-inner font-bold"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                  setCurrentId(null);
                  setNewCustomer({
                    name: "",
                    email: "",
                    phone: "",
                    status: "Active"
                  });
                }}
                className="flex-1 py-4 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95"
              >
                {isEditing ? 'Update' : 'Create'}
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
