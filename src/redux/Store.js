import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // بيحفظ في الـ Local Storage
import authReducer from '../store/authSlice';
import inventoryReducer from '../store/inventorySlice';

// 1. إعدادات الحفظ (Persist Config)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['inventory'] // هنحفظ بس الـ inventory عشان نضمن ثبات المخزن والتاريخ
};

// 2. تجميع الـ Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  inventory: inventoryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. إعداد الـ Store مع الـ Middleware اللازم لـ redux-persist
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // تعطيل الفحص للسماح لـ persist بالعمل بسلاسة مع Vite
    }),
});

export const persistor = persistStore(store);