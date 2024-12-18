

import { createSlice } from "@reduxjs/toolkit";
import { PaymentsState } from "./paymentsTypes";
import { fetchPayments, savePayment, deletePayment } from "./paymentsThunks";

  const initialState: PaymentsState = {
    payments: [],
    loading: false,
    error: null,
  };

  const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch Payments
        .addCase(fetchPayments.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPayments.fulfilled, (state, action) => {
          state.loading = false;
          state.payments = action.payload;
        })
        .addCase(fetchPayments.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // Save Payment
        .addCase(savePayment.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(savePayment.fulfilled, (state, action) => {
          state.loading = false;
          state.payments.push(action.payload);
        })
        .addCase(savePayment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        // Delete Payment
        .addCase(deletePayment.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deletePayment.fulfilled, (state, action) => {
          state.loading = false;
          state.payments = state.payments.filter((p) => p.id !== action.payload);
        })
        .addCase(deletePayment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export const { clearError } = paymentsSlice.actions;
  export default paymentsSlice.reducer;
