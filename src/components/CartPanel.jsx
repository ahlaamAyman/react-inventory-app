import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';

const CartPanel = () => {
    const {cart, completeSale} = useContext(AppContext);
    const total = cart.reduce((sum, item) => sum +Number(item.price) * item.quantity, 0);
  return (
    <div className='bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-fit border border-gray-100'>
        <h3 className='text-xl font-bold mb-4'>Shopping Cart</h3>
        <div className='space-y-3 mb-6'>
            {cart.map((item,index)=>(
                <div key={index} className='flex items-center gap-3'>
                    <span>{item.title}</span>
                    <span className='font-bold'>${item.price}</span>
                </div>
            ))}
        </div>
        <div className='text-2xl font-black mb-6'>Total: ${total}</div>
        <button onClick={completeSale} 
        className='w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all'>
            Complete Sale

        </button>
      
    </div>
  )
}

export default CartPanel
