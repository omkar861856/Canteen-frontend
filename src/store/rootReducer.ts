import { combineReducers } from '@reduxjs/toolkit';

import menuReducer from './slices/menuSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/ordersSlice';
import paymentsReducer from './slices/paymentsSlice';
import socketReducer from './slices/socketSlice';
import notificationsReducer from './slices/notificationsSlice';
import generalFeedbackReducer from './slices/generaFeedbackSlice';
import authReducer from './slices/authSlice';
import mainAppReducer from './slices/appSlice';

// Combine all reducers
const appReducer = combineReducers({
  menu: menuReducer,
  cart: cartReducer,
  orders: orderReducer,
  payments: paymentsReducer,
  socket: socketReducer,
  notifications: notificationsReducer,
  generalFeedback: generalFeedbackReducer,
  auth: authReducer,
  app: mainAppReducer,
});

const rootReducer = (state:any, action:any) => {
  if (action.type === 'persist/REHYDRATE' && action.payload) {
    // Merge persisted state with the current state
    const mergedState = {
      ...state, // Current state
      ...action.payload, // Persisted state
    };

    return appReducer(mergedState, action);
  }

  return appReducer(state, action);
};

export default rootReducer;