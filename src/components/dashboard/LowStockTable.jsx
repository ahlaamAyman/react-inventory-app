import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const LowStockTable = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('lowStock.title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('lowStock.subtitle')}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
          {items.length} {t('lowStock.alertsCount')}
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse" dir="auto">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60">
              <th className="pb-3 px-2 text-start">{t('lowStock.product')}</th>
              <th className="pb-3 px-2 text-center">{t('lowStock.remaining')}</th>
              <th className="pb-3 px-2 text-end">{t('lowStock.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail || 'https://via.placeholder.com/40'}
                        alt={item.title}
                        className="w-10 h-10 object-contain rounded-xl bg-slate-50 dark:bg-slate-900 p-1"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">{item.brand || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block font-black px-2.5 py-1 rounded-xl text-xs ${
                        Number(item.stock) <= 2
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {item.stock} {t('lowStock.left')}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-end">
                    <span className="text-xs font-semibold text-rose-500">
                      {t('lowStock.reorder')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-slate-400">
                  <i className="fas fa-check-circle text-emerald-500 text-2xl mb-2 block"></i>
                  {t('lowStock.allStocked')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LowStockTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      brand: PropTypes.string,
      stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      thumbnail: PropTypes.string,
    })
  ).isRequired,
};

export default LowStockTable;
