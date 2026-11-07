import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://dummyjson.com/products?limit=24');
      return response.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', 
  error: null,
  salesHistory: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    completeSaleAction: (state, action) => {
      const { cartItems, totalAmount, date, customerName } = action.payload;


      cartItems.forEach((cartItem) => {
        const product = state.items.find((item) => item.id === cartItem.id);
        if (product) {
          product.stock = Math.max(0, product.stock - cartItem.qty);
        }
      });

      // 2. Prepend sale to sales history with valid schema
      const newSale = {
        id: Date.now(),
        orderRef: `#${Date.now().toString().slice(-6)}`,
        customerName: customerName || 'Walk-in Customer',
        items: cartItems,
        total: Number(totalAmount) || 0,
        date: date || new Date().toLocaleString(),
        status: 'Completed',
      };

      state.salesHistory.unshift(newSale);
    },
    addProduct: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setSalesHistory: (state, action) => {
      state.salesHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred fetching products';
      });
  },
});

export const {
  completeSaleAction,
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  setSalesHistory,
} = inventorySlice.actions;

// Base selector
export const selectAllProducts = (state) => state.inventory.items;

// Memoized selectors via createSelector (prevents unnecessary re-renders)
export const selectLowStockProducts = createSelector(
  [selectAllProducts],
  (items) => items.filter((item) => Number(item.stock) <= 5 && Number(item.stock) > 0)
);

export const selectOutOfStockProducts = createSelector(
  [selectAllProducts],
  (items) => items.filter((item) => Number(item.stock) === 0)
);

export const selectTotalProducts = createSelector(
  [selectAllProducts],
  (items) => items.length
);

export const selectTotalStock = createSelector(
  [selectAllProducts],
  (items) => items.reduce((acc, item) => acc + (Number(item.stock) || 0), 0)
);

export const selectInventoryValue = createSelector(
  [selectAllProducts],
  (items) =>
    items.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.stock) || 0),
      0
    )
);

export default inventorySlice.reducer;