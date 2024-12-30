import { apiUrl } from "../../Layout";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Payment } from "./paymentsTypes";


export const fetchPayments = createAsyncThunk(
    'payments/fetchPayments',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${apiUrl}/payments`);
        return response.data; // Assuming the API returns a list of payments
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const savePayment = createAsyncThunk(
    'payments/savePayment',
    async (payment: Payment, thunkAPI) => {
      const state:any = thunkAPI.getState();
      const {kitchenId} = state.app
      try {
        const response = await axios.post(`${apiUrl}/payments`, {...payment, kitchenId});
        return response.data; // Assuming the API returns the saved payment
      } catch (error: any) {
        throw new Error(error)
      }
    }
  );

  export const deletePayment = createAsyncThunk(
    'payments/deletePayment',
    async (paymentId: string, { rejectWithValue }) => {
      try {
        await axios.delete(`${apiUrl}/payments/${paymentId}`);
        return paymentId; // Return the deleted payment ID
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );