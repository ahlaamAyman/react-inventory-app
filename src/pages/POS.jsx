import { useContext, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext';
import { completeSaleAction } from '../store/inventorySlice';

const POS = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.inventory);
  const { cart, setCart, customers } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Filter products by search and stock status
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const category = (p.category || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const matchesSearch = !term || title.includes(term) || category.includes(term) || brand.includes(term);

      if (!matchesSearch) return false;

      const stock = Number(p.stock) || 0;
      if (filterMode === 'inStock') return stock > 5;
      if (filterMode === 'lowStock') return stock > 0 && stock <= 5;
      if (filterMode === 'outOfStock') return stock === 0;

      return true;
    });
  }, [items, search, filterMode]);

  // Cart Management with Maximum Stock Boundaries
  const addToCart = (product) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      toast.error(t('pos.outOfStock'));
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    const currentQty = existing ? existing.qty : 0;

    if (currentQty + 1 > stock) {
      toast.error(t('pos.maxStockReached'));
      return;
    }

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const decrementQty = (productId) => {
    setCart(
      cart
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    if (cart.length > 0 && window.confirm(t('pos.clearCart') + '?')) {
      setCart([]);
    }
  };

  // Safe Financial Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
  }, [cart]);

  const tax = subtotal * 0.05; // 5% estimated tax
  const totalPayable = subtotal + tax;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    // Verify stock availability one final time before completing
    for (const cartItem of cart) {
      const product = items.find((i) => i.id === cartItem.id);
      if (!product || Number(product.stock) < cartItem.qty) {
        toast.error(`Not enough stock for ${cartItem.title}!`);
        return;
      }
    }

    const customerObj = customers.find((c) => String(c.id) === String(selectedCustomerId));

    const saleData = {
      cartItems: cart,
      totalAmount: totalPayable,
      date: new Date().toLocaleString(),
      customerName: customerObj ? customerObj.name : t('pos.walkInCustomer'),
    };

    dispatch(completeSaleAction(saleData));
    setCart([]);
    toast.success(t('pos.saleSuccess'));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-300">
      {/* Products Catalog Column */}
      <div className="flex-[2] flex flex-col gap-6">
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Search & Stock Filter Header */}
          <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {t('pos.title')}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t('pos.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 text-xs font-bold">
                  {filteredProducts.length} {t('pos.items')}
                </span>
              </div>
            </div>

            {/* Search Input with Logical RTL Positioning */}
            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-search absolute start-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  placeholder={t('pos.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ps-12 pe-10 py-3.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: t('pos.all') },
                  { id: 'inStock', label: t('pos.inStock') },
                  { id: 'lowStock', label: t('pos.lowStock') },
                  { id: 'outOfStock', label: t('pos.outOfStock') },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilterMode(option.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      filterMode === option.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stock = Number(product.stock) || 0;
                  const isAvailable = stock > 0;
                  const inCartItem = cart.find((i) => i.id === product.id);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => addToCart(product)}
                      className={`group relative flex flex-col text-start rounded-2xl border p-3 transition duration-200 ${
                        isAvailable
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 hover:shadow-lg active:scale-95'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="h-32 w-full rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2 mb-3">
                        <img
                          src={product.thumbnail || 'https://via.placeholder.com/100'}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* In-Cart Indicator */}
                      {inCartItem && (
                        <span className="absolute top-2 end-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shadow">
                          {inCartItem.qty}
                        </span>
                      )}

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            {product.category || 'General'}
                          </p>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                            {product.title}
                          </h3>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                              stock <= 3
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                            }`}
                          >
                            {stock} {t('lowStock.left')}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center text-slate-400">
                  <i className="fas fa-search text-3xl mb-2 block"></i>
                  {t('inventory.noProductsFound')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart & Checkout Panel */}
      <aside className="w-full xl:w-[420px] flex flex-col gap-6">
        {/* Order Payment Card */}
        <div className="rounded-[2.5rem] bg-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {t('pos.currentOrder')}
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {cart.length} {t('pos.items')}
              </h2>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold underline"
              >
                {t('pos.clearCart')}
              </button>
            )}
          </div>

          {/* Customer Selector */}
          <div className="mt-4">
            <label className="text-xs text-slate-400 block mb-1.5 font-bold">
              {t('pos.assignCustomer')}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">{t('pos.walkInCustomer')}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone || c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-5 rounded-2xl bg-slate-950/60 p-4 border border-white/5 space-y-2.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>{t('pos.subtotal')}</span>
              <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('pos.tax')}</span>
              <span className="text-white font-bold">${tax.toFixed(2)}</span>
            </div>
            <div className="pt-2.5 border-t border-white/10 flex justify-between text-base font-black text-white">
              <span>{t('pos.total')}</span>
              <span className="text-indigo-400">${totalPayable.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleCompleteSale}
            className="mt-5 w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed font-black text-sm uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            {t('pos.completeSale')}
          </button>
        </div>

        {/* Detailed Cart List */}
        <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {t('pos.itemsInCart')} ({cart.length})
          </h3>

          <div className="max-h-[380px] overflow-y-auto space-y-3 custom-scrollbar pe-1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800"
                >
                  <img
                    src={item.thumbnail || 'https://via.placeholder.com/40'}
                    alt={item.title}
                    className="w-12 h-12 object-contain rounded-xl bg-white dark:bg-slate-900 p-1 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ${Number(item.price).toFixed(2)} {t('pos.each')}
                    </p>
                  </div>

                  {/* Quantity Stepper Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrementQty(item.id)}
                      className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-900 dark:text-white min-w-[16px] text-center">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 ms-1 text-xs"
                      aria-label="Remove item"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                {t('pos.cartEmpty')}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default POS;