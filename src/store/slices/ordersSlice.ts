import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  userId: string | undefined;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderedAt: string;
  completedAt?: string | null;
}

const initialState: Order[] = [];

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Create: Add a new order
    addOrder: (state, action: PayloadAction<Order>) => {
      state.push(action.payload);
      console.log(action.payload)
    },

    // Read: Fetch all orders (this can be handled by selecting from the state)
    fetchOrders: (state) => state, // Optional, since you can directly select state

    // Update: Update an existing order
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.findIndex((order) => order.orderId === action.payload.orderId);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },

    // Delete: Remove an order by orderId
    deleteOrder: (state, action: PayloadAction<string>) => {
      return state.filter((order) => order.orderId !== action.payload);
    },

    // Optional: To update the order status (example: marking as completed or cancelled)
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: 'pending' | 'completed' | 'cancelled' }>) => {
      const index = state.findIndex((order) => order.orderId === action.payload.orderId);
      if (index !== -1) {
        state[index].status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrder, deleteOrder, fetchOrders, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
