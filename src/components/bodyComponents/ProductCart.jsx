import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ProductCart = ({ product, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const stock = Number(product.stock) || 0;
  const isLowStock = stock <= 5 && stock > 0;
  const isOutOfStock = stock === 0;

  return (
    <div
      className={`group bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full ${
        isLowStock
          ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] dark:border-amber-500/50'
          : isOutOfStock
          ? 'border-rose-300 dark:border-rose-800/60 opacity-80'
          : 'border-slate-100 dark:border-slate-700/80'
      }`}
    >
      {/* Product Image Frame */}
      <div className="relative h-48 mb-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/200?text=No+Image'}
          alt={product.title}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Stock Badge */}
        <div
          className={`absolute top-3 end-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
            isOutOfStock
              ? 'bg-rose-600'
              : isLowStock
              ? 'bg-amber-500 animate-pulse'
              : 'bg-emerald-600'
          }`}
        >
          {isOutOfStock
            ? t('inventory.card.outOfStock')
            : `${stock} ${t('inventory.card.inStock')}`}
        </div>

        {product.category && (
          <span className="absolute bottom-3 start-3 px-2.5 py-1 rounded-xl bg-slate-900/70 backdrop-blur-sm text-[10px] font-semibold text-white capitalize">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {product.brand || '---'}
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mt-1 leading-snug">
            {product.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">{t('common.price')}</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              ${Number(product.price || 0).toFixed(2)}
            </span>
          </div>
          {isLowStock && (
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
              <i className="fas fa-exclamation-triangle"></i> {t('inventory.card.lowStock')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <i className="fas fa-edit"></i>
            <span>{t('common.edit')}</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <i className="fas fa-trash-alt"></i>
            <span>{t('common.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCart.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    brand: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    thumbnail: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductCart;