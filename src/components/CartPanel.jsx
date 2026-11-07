import PropTypes from 'prop-types';

const CartPanel = ({ cart = [], onCompleteSale, onClearCart }) => {
  const total = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Shopping Cart</h3>
        {cart.length > 0 && onClearCart && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-500 hover:underline font-bold"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-700/60"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-[11px] text-slate-400">Qty: {item.qty || 1}</p>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                ${((item.qty || 1) * (Number(item.price) || 0)).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">Your cart is empty.</p>
        )}
      </div>

      <div className="text-xl font-black text-slate-900 dark:text-white mb-5 flex justify-between">
        <span>Total:</span>
        <span className="text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
      </div>

      <button
        type="button"
        disabled={cart.length === 0}
        onClick={onCompleteSale}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
      >
        Complete Checkout
      </button>
    </div>
  );
};

CartPanel.propTypes = {
  cart: PropTypes.array,
  onCompleteSale: PropTypes.func,
  onClearCart: PropTypes.func,
};

export default CartPanel;
