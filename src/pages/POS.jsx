import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/AppContext';
import React, { useContext, useState } from 'react';
import { completeSaleAction } from '../store/inventorySlice';
import toast from 'react-hot-toast';

const POS = () => {

  const dispatch = useDispatch();

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const saleData = {
      cartItems: cart,
      totalAmount: total,
      date: new Date().toLocaleString('ar-EG'), // تسجيل الوقت بالنسق المصري
    };

    // إرسال البيانات للريدكس (للمخزن وللتاريخ مع بعض)
    dispatch(completeSaleAction(saleData));

    setCart([]); // مسح السلة
    toast.success("تمت البيعة بنجاح وتحديث السجل!");
  };

  const { items } = useSelector((state) => state.inventory);
  
  const { cart, setCart } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState('all');

  const filtered = items.filter((p) => {
    const title = p.title.toLowerCase();
    const category = (p.category || '').toLowerCase();
    const term = search.toLowerCase();
    const matchesSearch = title.includes(term) || category.includes(term);

    if (!matchesSearch) return false;

    if (filterMode === 'inStock') {
      return p.stock > 0;
    }

    if (filterMode === 'outOfStock') {
      return p.stock === 0;
    }

    if (filterMode === 'lowStock') {
      return p.stock > 0 && p.stock <= 5;
    }

    return true;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) return; 
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[calc(100vh-120px)] bg-slate-100 dark:bg-slate-950">
      <div className="flex-[2] flex flex-col gap-5">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Point of Sale</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Pick products and build a fresh order with simple checkout.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-indigo-600/10 text-indigo-700 px-4 py-2 text-sm font-semibold">{filtered.length} products</span>
                <span className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-500">Cart {cart.length}</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'inStock', label: 'In Stock' },
                  { id: 'lowStock', label: 'Low Stock' },
                  { id: 'outOfStock', label: 'Out of Stock' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilterMode(option.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filterMode === option.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => product.stock > 0 && addToCart(product)}
                    className={`group flex flex-col overflow-hidden rounded-3xl border transition duration-300 ${
                      product.stock > 0
                        ? 'border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900'
                        : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-70 grayscale dark:border-slate-700 dark:bg-slate-900'
                    }`}
                  >
                    <div className="relative flex h-44 items-center justify-center bg-slate-50 dark:bg-slate-800">
                      <img src={product.thumbnail} alt={product.title} className="max-h-36 object-contain" />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4 text-left">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{product.title}</h3>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{product.category || 'Product'}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="text-lg font-extrabold text-indigo-600">${product.price}</span>
                        <span className="rounded-2xl bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-3xl bg-slate-50 dark:bg-slate-900 p-12 text-center text-slate-500">
                  No products found in inventory.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-[420px] flex flex-col gap-5">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Current Order</p>
              <h2 className="mt-3 text-3xl font-extrabold">{cart.length} items</h2>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-200">Total</div>
          </div>

          <div className="mt-6 rounded-[2rem] bg-slate-950/80 p-5 border border-white/10">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
              <span>Taxes</span>
              <span>—</span>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6 text-xl font-bold text-white flex items-center justify-between">
              <span>Payable</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className="mt-6 inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            Complete Sale
          </button>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review items before checkout and remove any mistakes.</p>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800 p-4">
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center">
                    <img src={item.thumbnail} alt={item.title} className="h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.qty} · ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] bg-slate-50 dark:bg-slate-800 p-8 text-center text-slate-400">
                Your cart is empty. Add products to start an order.
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default POS;