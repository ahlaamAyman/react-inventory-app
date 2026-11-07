import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../store/authSlice';
import inventoryReducer from '../store/inventorySlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['inventory'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  inventory: inventoryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);