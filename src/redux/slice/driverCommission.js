// src/redux/slice/commission.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */

// GET commissions
export const fetchDriverCommissions = createAsyncThunk(
  'commission/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/driverCommission`)
      console.log('Driver Commissions:', res.data.data)
      return res.data.data
    } catch (err) {
      console.error('Error fetching commissions:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// UPDATE commission
export const updateDriverCommission = createAsyncThunk(
  'commission/update',
  async ({ driverType, vehicle, commissionPercentage }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post(`/driverCommission/update`, {
        driverType,
        vehicle,
        commissionPercentage,
      })
      console.log('Updated Commission:', res.data.data)
      toast.success('Commission updated successfully')
      return res.data.data
    } catch (err) {
      console.error('Error updating commission:', err)
      toast.error(err.response?.data?.message ?? 'Failed to update commission')
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
  commissions: [], // list of commission objects { driverType, vehicle, commissionPercentage, ... }
}

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */
const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    resetCommissionState(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------- FETCH COMMISSIONS -------------------- */
      .addCase(fetchDriverCommissions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDriverCommissions.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.commissions = payload
      })
      .addCase(fetchDriverCommissions.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load commissions'
        toast.error(state.error)
      })

      /* -------------------- UPDATE COMMISSION -------------------- */
      .addCase(updateDriverCommission.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateDriverCommission.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        // Update the existing commission in state
        const idx = state.commissions.findIndex(
          (c) => c.driverType === payload.driverType && c.vehicle === payload.vehicle,
        )
        if (idx !== -1) {
          state.commissions[idx] = payload
        } else {
          state.commissions.push(payload)
        }
      })
      .addCase(updateDriverCommission.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to update commission'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                            */
/* ------------------------------------------------------------------ */
export const { resetCommissionState } = commissionSlice.actions
export default commissionSlice.reducer
