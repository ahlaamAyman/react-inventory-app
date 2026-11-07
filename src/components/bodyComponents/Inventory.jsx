import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from '../../store/inventorySlice';
import { exportToExcel } from '../../utils/exportUtils';
import ProductCart from './ProductCart';

const Inventory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    title: '',
    brand: '',
    category: '',
    stock: '',
    price: '',
    thumbnail: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Dynamic unique categories derived from actual inventory items
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((p) => p.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [items]);

  // Combined Search by Title/Brand/Category + Selected Category Filter
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        !term ||
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.brand && item.brand.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error(t('inventory.toast.imageTooLarge'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error(t('inventory.toast.titleRequired'));
      return;
    }

    if (isEditing) {
      const existing = items.find((p) => p.id === editingId);
      const updatedProduct = {
        ...existing,
        title: formData.title.trim(),
        brand: formData.brand.trim() || 'Generic',
        category: formData.category.trim() || 'General',
        stock: Math.max(0, Number(formData.stock) || 0),
        price: Math.max(0, Number(formData.price) || 0),
        thumbnail:
          formData.thumbnail || existing?.thumbnail || 'https://via.placeholder.com/150',
      };
      dispatch(updateProduct(updatedProduct));
      toast.success(t('inventory.toast.updated'));
    } else {
      const newProduct = {
        id: Date.now(),
        title: formData.title.trim(),
        brand: formData.brand.trim() || 'Generic',
        category: formData.category.trim() || 'General',
        stock: Math.max(0, Number(formData.stock) || 0),
        price: Math.max(0, Number(formData.price) || 0),
        thumbnail:
          formData.thumbnail || 'https://via.placeholder.com/150',
      };
      dispatch(addProduct(newProduct));
      toast.success(t('inventory.toast.added'));
    }

    closeModal();
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormData({
      title: product.title || '',
      brand: product.brand || '',
      category: product.category || '',
      stock: product.stock !== undefined ? String(product.stock) : '',
      price: product.price !== undefined ? String(product.price) : '',
      thumbnail: product.thumbnail || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(t('inventory.toast.confirmDelete'))) {
      dispatch(deleteProduct(id));
      toast.success(t('inventory.toast.deleted'));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleExport = () => {
    if (items.length === 0) {
      toast.error(t('inventory.toast.exportEmpty'));
      return;
    }
    const dataToExport = filteredProducts.map((p) => ({
      ID: p.id,
      Title: p.title,
      Brand: p.brand || '---',
      Category: p.category || 'General',
      Stock: p.stock,
      Price: `$${Number(p.price).toFixed(2)}`,
    }));
    exportToExcel(dataToExport, 'Inventory_Catalog_Report');
    toast.success(t('inventory.toast.exportSuccess'));
  };

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <i className="fas fa-circle-notch fa-spin text-3xl text-indigo-600"></i>
        <p className="text-base font-bold text-slate-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search & Category Filter Section */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
          {/* Search Input with Logical RTL Positioning */}
          <div className="relative w-full group">
            <div className="absolute inset-y-0 start-0 ps-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600">
              <i className="fas fa-search text-base"></i>
            </div>
            <input
              type="text"
              placeholder={t('inventory.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-14 pe-14 py-4 bg-slate-50 dark:bg-slate-700/60 rounded-2xl border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm font-medium transition shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <i className="fas fa-times-circle text-base"></i>
              </button>
            )}
          </div>

          {/* Dynamic Category Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 capitalize ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? t('common.all') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('inventory.title')} ({filteredProducts.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('inventory.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <i className="fas fa-file-excel"></i>
            <span>{t('common.exportExcel')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <i className="fas fa-plus"></i>
            <span>{t('inventory.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCart
              key={item.id}
              product={item}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-12 text-center border border-slate-100 dark:border-slate-700">
            <i className="fas fa-box-open text-4xl text-slate-300 dark:text-slate-600 mb-3 block"></i>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">
              {t('inventory.noProductsFound')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t('inventory.noProductsSub')}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-700">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {isEditing ? t('inventory.editProduct') : t('inventory.addProduct')}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('inventory.form.title')}
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('inventory.form.titlePlaceholder')}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('inventory.form.brand')}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder={t('inventory.form.brandPlaceholder')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('inventory.form.category')}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder={t('inventory.form.categoryPlaceholder')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('inventory.form.stock')}
                  </label>
                  <input
                    required
                    min="0"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder={t('inventory.form.stockPlaceholder')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('inventory.form.price')}
                  </label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder={t('inventory.form.pricePlaceholder')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Product Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('inventory.form.image')}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:me-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-500/10 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-12 h-12 rounded-xl object-contain border border-indigo-400 p-0.5 bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  {t('inventory.form.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition active:scale-95"
                >
                  {isEditing ? t('inventory.form.update') : t('inventory.form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
