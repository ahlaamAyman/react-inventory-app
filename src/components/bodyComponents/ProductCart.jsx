import React from 'react'
const ProductCart = ({product, onEdit, onDelete}) => {
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border p-4 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col h-full 
      ${isLowStock ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-100 dark:border-gray-700'}`}>
        
        <div className='relative h-48 mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden'>
            <img src={product.thumbnail || "https://via.placeholder.com/150"}
                alt={product.title}
                className='w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-2'
            />
            
            <div className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-md transition-all
                ${isOutOfStock ? 'bg-gray-900 animate-pulse' : 
                  isLowStock ? 'bg-red-600 animate-bounce' : 'bg-green-500'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : `${product.stock} Units`}
            </div>

            {isLowStock && (
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none flex items-center justify-center">
                 <i className="fas fa-exclamation-triangle text-red-500/20 text-6xl"></i>
              </div>
            )}
        </div>

        <div className='grid grid-rows-[auto_1fr_auto] flex-grow gap-2'>
            <div className="min-h-[60px]">
                <h3 className='text-md font-bold text-gray-800 dark:text-white line-clamp-2 leading-tight'>
                    {product.title}
                </h3>
                <p className='text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold'>
                    {product.brand}
                </p>
            </div>

            <div className='flex items-center justify-between'>
                <span className='text-indigo-600 dark:text-indigo-400 font-black text-xl'>
                    ${product.price}
                </span>
                {isLowStock && <span className="text-[10px] text-red-500 font-bold animate-pulse">Low Inventory</span>}
            </div>

            <div className='grid grid-cols-2 gap-2 border-t dark:border-gray-700 pt-3 mt-2'>
                <button 
                    onClick={() => onEdit(product)} 
                    className='flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-95 text-sm'
                >
                    <i className='fas fa-edit'></i>
                    <span>Edit</span>
                </button>
                
                <button 
                    onClick={() => onDelete(product.id)} 
                    className='flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl transition-all active:scale-95 text-sm font-medium'
                >
                    <i className='fas fa-trash'></i>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ProductCart;