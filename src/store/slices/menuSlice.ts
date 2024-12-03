import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../Layout';


export interface InventoryItem {
  itemId: string,
  name: string,
  category: string,
  price: number,
  quantityAvailable: number,
  availability: boolean,
  image?: string,
  createdAt: string,
  updatedAt: string,
}

interface InventoryState {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {

  inventory: [],
  loading: false,
  error: null

}

// Thunk to fetch data
export const fetchInventory = createAsyncThunk<InventoryItem[]>('menu/fetchOrders', async () => {
  const response = await axios.get(`${apiUrl}/inventory`);
  return response.data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchInventory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchInventory.fulfilled, (state, action) => {
            state.loading = false;
            state.inventory = action.payload;
        })
        .addCase(fetchInventory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch data';
        });
},
});

export const { } = menuSlice.actions;
export default menuSlice.reducer;