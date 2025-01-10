import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage (localStorage)
import rootReducer from './rootReducer';



// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["menu", "cart", 'notifications', 'auth'], // Reducers to persist
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
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);

persistor.subscribe(() => {
  if (persistor.getState().bootstrapped) {
    console.log('State has been rehydrated:', store.getState());
  }
});

// RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;