import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

// 👇 Async Thunk to fetch advertisements
export const fetchAdvertisements = createAsyncThunk(
  'advertisement/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await HttpClient.get('/advertisement/getAdvertisement', {
        params,
      })
      console.log('Advertisements:', response.data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
);

// Approve Advertisement
export const approveAdvertisement = createAsyncThunk(
  'advertisement/approve',
  async (id, { rejectWithValue }) => {
    try {
      const res = await HttpClient.patch(`/advertisement/approve/${id}`)
      toast.success('Advertisement approved')
      return { id, status: 'approved' }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve ad')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// Reject Advertisement
export const rejectAdvertisement = createAsyncThunk(
  'advertisement/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.patch(`/advertisement/reject/${id}`, { reason })
      toast.success('Advertisement rejected')
      return { id, status: 'rejected', reason }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject ad')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// Delete Advertisement
export const deleteAdvertisement = createAsyncThunk(
  'advertisement/delete',
  async (id, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/advertisement/deleteAdsByAdmin/${id}`)
      toast.success('Advertisement deleted')
      return id
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete ad')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)



const initialState = {
  data: [],
  pagination: null,
  notReported: null,
  totalAds: null,
  status: 'idle',
  error: null,
}

const advertisementSlice = createSlice({
  name: 'advertisement',
  initialState,
  reducers: {
    clearAdvertisements(state) {
      state.data = []
      state.pagination = null
      state.notReported = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvertisements.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAdvertisements.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.data = payload.data.advertisements
        state.notReported = payload.data.notReportedCount
        state.pagination = payload.data.pagination
        state.totalAds = payload.data.totalads
      })
      .addCase(fetchAdvertisements.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch advertisements'
        state.pagination = null
        state.data = []
        state.status = 'error'
        state.totalAds = payload.data.totalads
        toast.error(state.error)
      })
      .addCase(approveAdvertisement.fulfilled, (state, { payload }) => {
        const ad = state.data.find((a) => a._id === payload.id)
        if (ad) ad.status = payload.status
      })
      .addCase(rejectAdvertisement.fulfilled, (state, { payload }) => {
        const ad = state.data.find((a) => a._id === payload.id)
        if (ad) ad.status = payload.status
      })
      .addCase(deleteAdvertisement.fulfilled, (state, { payload }) => {
        state.data = state.data.filter((ad) => ad._id !== payload)
      })


  },
})

export const { clearAdvertisements } = advertisementSlice.actions;
export default advertisementSlice.reducer;
