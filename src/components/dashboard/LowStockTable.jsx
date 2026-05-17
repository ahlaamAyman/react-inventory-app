import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const LowStockTable = ({items}) => {
  const { darkMode } = useTheme();
  return (
    <div className='bg-white p-6 rounded-3xl shadow-sm border border-red-50 h-full dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex items-center gap-3 mb-6'>
            <div className='bg-red-100 p-2 rounded-lg'>
                <i className='fas fa-exclamation-triangle text-red-600'></i>
            </div>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white'>Low Stock Alerts</h3>
        </div>


        <div className='overflow-x-auto'>
            <table className='w-full table-auto border-collapse'>
                <thead>
                    <tr className='text-gray-400 text-sm border-b border-gray-50 dark:border-gray-700'>
                        <th className='pb-4 px-2'>Product</th>
                        <th className='pb-4'> Stock</th>
                        <th className='pb-4 text-right'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id} className={`text-sm transition-colors ${Number(item.stock)<3 ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                <td className='py-4 px-2'>
                                    <div className='flex flex-col'>
                                        <span className='font-bold dark:text-white'>{item.title}</span>
                                        {Number(item.stock) < 3 && <span className='text-red-500 text-xs dark:text-red-400'>Only {item.stock} left in stock!</span>}
                                    </div>
                                </td>
                                <td className='py-4 px-2'>
                                    <span className={`font-bold px-2 py-1 rounded-lg ${Number(item.stock) < 3 ? 'bg-red-100 text-red-700 ' : 'bg-green-100 text-green-700'}`}>{item.stock}</span>
                                </td>
                                <td className='py-4 px-2 text-right'>
                                    <button className='bg-blue-50 text-blue-600 py-1  rounded-md text-xs font-bold hover:bg-blue-600 hover:text-white transition-all'>
                                        Order Now
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="py-4 px-2 text-center text-gray-500 dark:text-gray-400">
                               <i className='fas fa-check-circle text-green-400 mb-2 block text-2xl'></i>
                               All item are well stocked!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
      
    </div>
  )
}

export default LowStockTable
