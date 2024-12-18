import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../Layout';
import { InventoryItem } from './menuSlice';

// Define interfaces for orders and their statuses
export interface Order {
    orderId: string;
    userId: string | undefined;
    items: InventoryItem[];
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    totalPreparationTime: number;
    totalPrice?:number;
    orderedAt?:string | undefined;
    completedAt?:string | undefined | null;
    razorpayPaymentId: string;
}

interface OrdersState {
    filter(arg0: (order: any) => boolean): unknown;
    orders: Order[];
    pendingOrders: Order[];
    loading: boolean;
    error: string | null | undefined;
}

// Initial state for orders
const initialState: OrdersState = {
    orders: [],
    pendingOrders: [],
    loading: false,
    error: null,
    filter: function (_: (order: any) => boolean): unknown {
        throw new Error('Function not implemented.');
    }
};

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async () => {
        try {
            const response = await axios.get(`${apiUrl}/orders`);
            return response.data; // Assuming the response contains the orders in the "orders" field
        } catch (error) {
            throw Error('Failed to fetch orders');
        }
    }
);

// Async thunk to fetch orders
export const fetchOrdersByUserId = createAsyncThunk(
  'orders/fetchByUserId',
  async (userId: string | undefined) => {
      try {
          const response = await axios.get(`${apiUrl}/orders/${userId}`);
          return response.data; 
      } catch (error) {
          throw Error('Failed to fetch orders');
      }
  }
);

// Async thunk to update the order status
export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, status }: { orderId: string; status: string }) => {
        try {
            const response = await axios.put(`${apiUrl}/order/${orderId}`, { status });
            return response.data.updatedOrder; // Assuming the updated order is returned
        } catch (error) {
            throw Error('Failed to update order status');
        }
    }
);

// Async thunk to fetch orders
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (order: Partial<Order>) => {
      try {
        console.log("started thunk to create order")
          const response = await axios.post(`${apiUrl}/orders`, order);
          console.log(response)
          return response.data; 
      } catch (error) {
          throw Error('Failed to fetch orders');
      }
  }
);

// Redux slice to manage orders
const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetch all orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                const orders = action.payload;
                state.pendingOrders = orders.filter(e => e.status === 'pending');
                state.orders = orders;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle fetch orders by user ID
            .addCase(fetchOrdersByUserId.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrdersByUserId.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                const userOrders = action.payload;
                state.orders = userOrders; // Replace current orders with the fetched user-specific orders
                state.pendingOrders = userOrders.filter(order => order.status === 'pending'); // Filter pending orders
            })
            .addCase(fetchOrdersByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle update order status
            .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
                const updatedOrder = action.payload;
                const index = state.orders.findIndex(order => order.orderId === updatedOrder.orderId);
                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                    if (updatedOrder.status === 'pending') {
                        const pendingIndex = state.pendingOrders.findIndex(order => order.orderId === updatedOrder.orderId);
                        if (pendingIndex !== -1) {
                            state.pendingOrders[pendingIndex] = updatedOrder;
                        } else {
                            state.pendingOrders.push(updatedOrder);
                        }
                    } else {
                        state.pendingOrders = state.pendingOrders.filter(order => order.orderId !== updatedOrder.orderId);
                    }
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Handle create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.loading = false;
                const newOrder = action.payload;
                state.orders.push(newOrder);
                if (newOrder.status === 'pending') {
                    state.pendingOrders.push(newOrder);
                }
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create order';
            });
    },
});


export default ordersSlice.reducer;