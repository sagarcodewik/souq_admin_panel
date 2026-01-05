import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HttpClient from "../../helper/http-client";
import { toast } from "react-toastify";

// 🔹 Fetch all driver payments (pending or approved)
export const fetchDriverPayments = createAsyncThunk(
  "adminDriverPayments/fetchAll",
  async (
    { page = 1, pageSize = 10, status = "", search = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await HttpClient.get("/driverCashLedger/getDriverCashLedger", {
        params: { page, pageSize, search, status },
      });
      return res.data.data; // { list, total, page, pageSize }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch driver payments");
      return rejectWithValue(err.response?.data ?? { message: err.message });
    }
  }
);

// 🔹 Approve driver payment
export const approveDriverPayment = createAsyncThunk(
  "adminDriverPayments/approve",
  async (ledgerId, { dispatch, rejectWithValue, getState }) => {
    try {
      const res = await HttpClient.post("/driverCashLedger/adminApproveDriverPayment", { ledgerId });

      toast.success("Driver payment approved successfully");

      // Re-fetch the list after approval (keep same pagination & search)
      const { page, pageSize } = getState().adminDriverPayments;
      dispatch(fetchDriverPayments({ page, pageSize }));

      return res.data.data.ledgerEntry; // the updated ledger entry
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve payment");
      return rejectWithValue(err.response?.data ?? { message: err.message });
    }
  }
);

const adminDriverPaymentsSlice = createSlice({
  name: "adminDriverPayments",
  initialState: {
    list: [],
    total: 0,
    page: 1,
    pageSize: 10,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchDriverPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDriverPayments.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.list = payload.list || [];
        state.total = payload.total || 0;
        state.page = payload.page || 1;
        state.pageSize = payload.pageSize || 10;
      })
      .addCase(fetchDriverPayments.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload?.message || "Failed to fetch data";
      })

      // Approve payment (update local list)
      .addCase(approveDriverPayment.fulfilled, (state, { payload }) => {
        const index = state.list.findIndex((l) => l._id === payload._id);
        if (index !== -1) {
          state.list[index] = payload;
        }
      });
  },
});

export default adminDriverPaymentsSlice.reducer;
