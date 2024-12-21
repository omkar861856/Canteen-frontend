import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiUrl } from '../../Layout';

// Define the initial state
interface FeedbackState {
  feedback: string;
  rating: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  date: string | null;
  userId: string | null;
}

const initialState: FeedbackState = {
  feedback: '',
  rating: 0,
  status: 'idle',
  error: null,
  date: "",
  userId: ""

};

// Thunk to send feedback to the backend
export const sendFeedback = createAsyncThunk(
  'feedback/sendFeedback',
  async (feedbackData: { feedback: string; rating: number, fullName: string | null | undefined}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/generalfeedback`, feedbackData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Failed to send feedback');
    }
  }
);

// Create the slice
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    // Optionally, you can add synchronous reducers if needed
    setFeedback: (state, action) => {
      state.feedback = action.payload.feedback;
      state.rating = action.payload.rating;
      state.date = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFeedback.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendFeedback.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;