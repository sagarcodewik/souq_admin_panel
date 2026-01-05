import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

// Fetch pending vendors
export const fetchPendingVendors = createAsyncThunk(
  'vendor/fetchPendingVendors',
  async (
    { page = 1, limit = 10, businessName = '', ownerName = '', email = '' },
    { rejectWithValue },
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        businessName,
        ownerName,
        email,
      }).toString()

      const response = await HttpClient.get(`/vendor/pending?${queryParams}`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// Update vendor status (Approved / Rejected)
export const updateVendorStatus = createAsyncThunk(
  'vendor/updateVendorStatus',
  async ({ vendorId, status, deleted }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/vendor/update/status', {
        vendorId,
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

export const fetchAllVendors = createAsyncThunk(
  'vendors/fetchAllVendors',
  async (
    { page = 1, pageSize = 10, sortKey = 'createdAt', sortDirection = 'desc', search = '' } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.get('/vendor/admin/all-vendors', {
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
  name: 'vendorApproval',
  initialState: {
    pendingVendors: [],
    vendors: [],
    totalRecords: 0,
    currentPage: 1,
    pageSize: 10,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetVendorApprovalState: (state) => {
      state.pendingVendors = []
      state.status = 'idle'
      state.error = null
    },
    clearVendors(state) {
      state.vendors = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PENDING
      .addCase(fetchPendingVendors.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPendingVendors.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.pendingVendors = payload.data?.vendors || []
        state.totalRecords = payload.data?.pagination?.totalRecords || 0
        state.currentPage = payload.data?.pagination?.currentPage || 1
        state.pageSize = payload.data?.pagination?.limit || 10
      })
      .addCase(fetchPendingVendors.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch vendors'
        toast.error(state.error)
      })

      // UPDATE STATUS
      .addCase(updateVendorStatus.fulfilled, (state, { payload }) => {
        const updatedVendor = payload.data
        state.pendingVendors = state.pendingVendors.filter(
          (vendor) => vendor._id !== updatedVendor._id,
        )
        state.vendors = state.vendors.map((vendor) =>
          vendor._id === updatedVendor._id ? updatedVendor : vendor,
        )
      })
      .addCase(updateVendorStatus.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to update vendor status'
      })
      .addCase(fetchAllVendors.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAllVendors.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.vendors = payload.data // array of vendors
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchAllVendors.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch vendors'
      })
  },
})

export const { resetVendorApprovalState, clearVendors } = vendorApprovalSlice.actions
export default vendorApprovalSlice.reducer
