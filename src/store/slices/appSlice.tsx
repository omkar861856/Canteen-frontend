import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../Layout';

interface AppState {
  kitchenNumber:string;
  kitchenId: string;
  loading:boolean;
  error:string | null;
  status: "loading" | "succeeded" | "failed" | null;
  kitchenStatus: "online" | "offline" | null;
}

const initialState: AppState = {
  kitchenId:"",
  kitchenNumber:"",
  loading:false,
  error:null,
  status: null,
  kitchenStatus: null,
};

// Thunk to send feedback to the backend
export const connectKitchen = createAsyncThunk(
  'app/connectKitchen',
  async (appData: AppState, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/generalfeedback`, appData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Failed to send feedback');
    }
  }
);

// Create the slice
const feedbackSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Optionally, you can add synchronous reducers if needed
    setKitchenStatus: (state, action) => {
      state.kitchenStatus = action.payload; // Assuming `kitchenStatus` exists in the initialState
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectKitchen.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(connectKitchen.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(connectKitchen.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setKitchenStatus } = feedbackSlice.actions;
export default feedbackSlice.reducer;