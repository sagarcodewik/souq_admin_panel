// src/redux/slice/vendors.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNK                                                             */
/* ------------------------------------------------------------------ */

/**
 * Fetch approved & profile-complete vendors.
 *
 * Supports optional pagination / sorting like the order slice.
 *
 *  – page          (default 1)
 *  – pageSize      (default 10)
 *  – sortKey       (default createdAt)
 *  – sortDirection (default desc)
 *  – search        (default '')
 */
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (
    { page = 1, pageSize = 10, sortKey = 'createdAt', sortDirection = 'desc', search = '' } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.get('/vendor/admin-vendors', {
        params: { page, pageSize, sortKey, sortDirection, search },
      })

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

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  vendors: [],
  status: 'idle', // fetch status
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
  selectedVendorId: null,
}

const vendorsSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearVendors(state) {
      state.vendors = []
      state.status = 'idle'
      state.error = null
    },
    setSelectedVendorId(state, action) {
      state.selectedVendorId = action.payload // ✅ Set vendorId
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- FETCH VENDORS ---------- */
      .addCase(fetchVendors.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVendors.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.vendors = payload.data // array of vendors
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchVendors.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch vendors'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearVendors, setSelectedVendorId } = vendorsSlice.actions
export default vendorsSlice.reducer
