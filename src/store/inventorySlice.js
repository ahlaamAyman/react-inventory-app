import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('inventory/fetchProducts', async () => {
    const response = await axios.get('https://dummyjson.com/products?limit=12');
    return response.data.products;
});

export const selectLowStockProducts = (state) => {
    return state.inventory.items.filter(item => item.stock <= 5 && item.stock > 0);
};

// 1. حساب إجمالي عدد المنتجات المختلفة
export const selectTotalProducts = (state) => state.inventory.items.length;

// 2. حساب إجمالي عدد القطع في المخزن (Stock)
export const selectTotalStock = (state) => 
    state.inventory.items.reduce((acc, item) => acc + Number(item.stock), 0);

// 3. حساب إجمالي قيمة المخزن (السعر × الكمية)
export const selectInventoryValue = (state) => 
    state.inventory.items.reduce((acc, item) => acc + (Number(item.price) * Number(item.stock)), 0);


export const selectOutOfStockProducts = (state) => {
    return state.inventory.items.filter(item => item.stock === 0);
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: { items: [], status: 'idle', salesHistory: [] },
    reducers: {
        completeSaleAction: (state, action) => {
            const { cartItems, totalAmount, date } = action.payload;

            // 1. تحديث المخزن
            cartItems.forEach((cartItem) => {
                const product = state.items.find((item) => item.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.qty;
                }
            });

            // 2. تسجيل العملية في الـ History
            state.salesHistory.unshift({
                id: Date.now(),
                items: cartItems,
                total: totalAmount,
                time: date,
            });
        },
        addProduct: (state, action) => {
            state.items.unshift(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        reduceStock: (state, action) => {
            const { cartItems } = action.payload;
            cartItems.forEach(cartItem => {
                const product = state.items.find(item => item.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.qty;
                }
            });
        },
        setProducts: (state, action) => {
            state.items = action.payload;
        },
        setSalesHistory: (state, action) => {
            state.salesHistory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
            });
    },
});

export const { 
    completeSaleAction, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    reduceStock, 
    setProducts, 
    setSalesHistory 
} = inventorySlice.actions;

export default inventorySlice.reducer;