// src/redux/slice/orders.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch active orders (status: confirmed | shipped).
 * Accepts optional pagination & sorting like the product slice.
 *
 *  – page          (default 1)
 *  – pageSize      (default 10)
 *  – sortKey       (default createdAt)
 *  – sortDirection (default desc)
 */
export const fetchActiveOrders = createAsyncThunk(
  'orders/fetchActiveOrders',
  async (
    {
      page = 1,
      pageSize = 10,
      sortKey = 'createdAt',
      sortDirection = 'desc',
      search = '',
      type = 0,
      excludedStatuses = ['delivered', 'cancelled', 'returned'],
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.post('/order/active', {
        page,
        pageSize,
        sortKey,
        sortDirection,
        search,
        type,
        excludedStatuses,
      })
      console.log('Active orders fetched:', res.data.data)
      /* controller returns { data, totalRecords, currentPage, pageSize } */
      return res.data.data
    } catch (err) {
      console.error('Failed to fetch active orders:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Update an order’s status (e.g. mark as delivered / cancelled).
 * Adjust the endpoint if you expose a different route.
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, paymentStatus }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.put(`/order/${orderId}/status`, {
        status, // 'delivered' | 'cancelled' | 'returned' | …
        paymentStatus, // 'paid' | 'refunded' | etc.  (optional)
      })
      toast.success('Order status updated!')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  orders: [],
  status: 'idle', // global fetch status
  error: null,

  updateStatus: 'idle', // status for updateOrderStatus
  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH ACTIVE ORDERS ---------- */
    builder
      .addCase(fetchActiveOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchActiveOrders.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.orders = payload.data // array of orders
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchActiveOrders.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch orders'
      })

      /* ---------- UPDATE ORDER STATUS ---------- */
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
        state.updateStatus = 'succeeded'
        const idx = state.orders.findIndex((o) => o._id === payload._id)
        if (idx !== -1) state.orders[idx] = payload
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.updateStatus = 'failed'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
