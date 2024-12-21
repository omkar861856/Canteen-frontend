import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage)
import menuReducer from './slices/menuSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/ordersSlice'
import paymentsReducer from './slices/paymentsSlice'
import socketReducer from './slices/socketSlice'
import notificationsReducer from './slices/notificationsSlice'
import generalFeedbackReducer from './slices/generaFeedbackSlice'



// Example slice reducer
import exampleReducer from './slices/exampleSlice';

// Combine all reducers
const rootReducer = combineReducers({
  example: exampleReducer,
  menu: menuReducer,
  cart: cartReducer,
  orders: orderReducer,
  payments: paymentsReducer,
  socket: socketReducer,
  notifications: notificationsReducer,
  generalFeedback: generalFeedbackReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["menu", "cart", 'notifications'], // Reducers to persist
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
//   middleware: [thunk], // Add thunk for async actions
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ['menu/fetchInventory','persist/PERSIST', 'persist/REHYDRATE'],
        // Optionally ignore specific keys in the state
        ignoredPaths: ['register'],
      },
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);

// RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;