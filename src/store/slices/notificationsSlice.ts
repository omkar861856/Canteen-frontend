import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  type: String;
  data: String;
}

// Initial state
const initialState: Notification[] = []

// Create the slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Push the notification object to the notifications array
      state.push(action.payload);
    },
    clearNotifications: () => {
      // Clear all notifications
      return [];
    },
  },
});

// Export actions and reducer
export const { addNotification, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;