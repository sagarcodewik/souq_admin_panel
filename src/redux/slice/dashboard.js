// src/redux/slice/dashboard.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */
export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/admin',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/dashboard/admin')
      console.log('Admin Dashboard data:', res.data.data)
      return res.data.data
    } catch (err) {
      console.error('Error fetching admin dashboard:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

export const fetchAdminSalesLineGraph = createAsyncThunk(
  'dashboard/admin/salesLineGraph',
  async ({ days = 30 } = {}, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/dashboard/admin/sales?days=${days}`)
      console.log('Admin Sales Line Graph data:', res.data.data)
      return res.data.data // { range: { startDate, endDate, days }, sales: [...] }
    } catch (err) {
      console.error('Error fetching sales line graph:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  INITIAL STATE                                                     */
/* ------------------------------------------------------------------ */
const initialState = {
  status: 'idle',
  error: null,
  data: {
    vendorReqCount: 0,
    driverReqCount: 0,
    activeOrderCount: 0,
    totalApprovedVendors: 0,
    approvedDiff: 0,
    returnRate: 0,
    avgOrderValue: 0,
    avgOrderValuePercentage: 0,
    customerSatisfaction: 0,
    recentOrders: [],
    topVendors: [],
    topCustomers: [],
    categoryDistribution: [],
    salesGraph: {
      range: { startDate: null, endDate: null, days: 30 },
      sales: [], // { date, totalSales }
    },
  },
}

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------- ADMIN DASHBOARD -------------------- */
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data.vendorReqCount = payload.vendorReqCount
        state.data.driverReqCount = payload.driverReqCount
        state.data.activeOrderCount = payload.activeOrderCount
        state.data.totalApprovedVendors = payload.totalApprovedVendors
        state.data.totalCustomers = payload.totalCustomers
        state.data.approvedDiff = payload.approvedDiff
        state.data.returnRate = payload.returnRate
        state.data.avgOrderValue = payload.avgOrderValue
        state.data.customerSatisfaction = payload.customerSatisfaction
        state.data.recentOrders = payload.recentOrders
        state.data.avgOrderValuePercentage = payload.avgOrderValuePercentage
        state.data.topVendors = payload.topVendors
        state.data.topCustomers = payload.topCustomers
        state.data.categoryDistribution = payload.categoryDistribution
      })
      .addCase(fetchAdminDashboard.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load dashboard data'
        toast.error(state.error)
      })

      /* -------------------- SALES LINE GRAPH -------------------- */
      .addCase(fetchAdminSalesLineGraph.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdminSalesLineGraph.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data.salesGraph = payload // { range, sales }
      })
      .addCase(fetchAdminSalesLineGraph.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load sales line graph'
        toast.error(state.error)
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                            */
/* ------------------------------------------------------------------ */
export const { resetDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
