import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

// Fetch pending vendors
export const fetchPendingDrivers = createAsyncThunk(
  'driver/fetchPendingDrivers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get('/driver/pending')
      console.log('Pending drivers:', response.data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// Update vendor status (Approved / Rejected)
export const updateDriverStatus = createAsyncThunk(
  'driver/updateDriverStatus',
  async ({ driverId, status, deleted }, { rejectWithValue }) => {
    try {
      console.log('drirver id', driverId)
      const response = await HttpClient.post('/driver/update/status', {
        driverId,
        status,
        deleted,
      })
      toast.success(response.message || 'Vendor updated successfully')
      return response.data
    } catch (err) {
      console.log('Update status error:', err)
      toast.error(err.response?.data?.message ?? 'Failed to update status')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
export const fetchAllDrivers = createAsyncThunk(
  'drivers/fetchAllDrivers',
  async (
    { page = 1, pageSize = 10, sortKey = 'createdAt', sortDirection = 'desc', search = '' } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.get('/driver/admin/all-drivers', {
        params: { page, pageSize, sortKey, sortDirection, search },
      })
      console.log('res', res)
      const { data, totalRecords, currentPage, pageSize: size } = res.data.data

      return {
        data,
        totalRecords,
        currentPage,
        pageSize: size,
      }
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch vendors.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)
const vendorApprovalSlice = createSlice({
  name: 'driverApproval',
  initialState: {
    pendingDrivers: [],
    drivers: [],
    totalRecords: 0,
    currentPage: 1,
    pageSize: 10,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetDriverApprovalState: (state) => {
      state.pendingDrivers = []
      state.status = 'idle'
      state.error = null
    },
    clearDrivers(state) {
      state.drivers = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PENDING
      .addCase(fetchPendingDrivers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPendingDrivers.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.pendingDrivers = payload.data
      })
      .addCase(fetchPendingDrivers.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch vendors'
        toast.error(state.error)
      })

      // UPDATE STATUS
      .addCase(updateDriverStatus.fulfilled, (state, { payload }) => {
        const updatedDriver = payload.data
        state.pendingDrivers = state.pendingDrivers.filter(
          (driver) => driver._id !== updatedDriver._id,
        )
        state.vendors = state.drivers.map((driver) =>
          driver._id === updatedDriver._id ? updatedDriver : driver,
        )
      })
      .addCase(fetchAllDrivers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAllDrivers.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.drivers = payload.data // array of vendors
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchAllDrivers.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch vendors'
      })
  },
})

export const { resetVendorApprovalState } = vendorApprovalSlice.actions
export default vendorApprovalSlice.reducer
