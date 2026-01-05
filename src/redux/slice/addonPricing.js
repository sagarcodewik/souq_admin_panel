// src/redux/slice/addonPricing.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */

// GET addon pricing
export const fetchAddonPricing = createAsyncThunk(
  'addonPricing/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/addonpricing`)
      console.log('Addon Pricing:', res.data.data)
      return res.data.data
    } catch (err) {
      console.error('Error fetching addon pricing:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// UPDATE addon pricing
export const updateAddonPricing = createAsyncThunk(
  'addonPricing/update',
  async ({ addonName, price, days, pricingType }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post(`/addonpricing/update`, {
        addonName,
        price,
        days,
        pricingType,
      })
      console.log('Updated Addon Pricing:', res.data.data)
      toast.success('Addon Pricing updated successfully')
      return res.data.data
    } catch (err) {
      console.error('Error updating addon pricing:', err)
      toast.error(err.response?.data?.message ?? 'Failed to update addon pricing')
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
  addonPricing: [],
}

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */
const addonPricingSlice = createSlice({
  name: 'addonPricing',
  initialState,
  reducers: {
    resetAddonPricingState(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------- FETCH ADDON PRICING -------------------- */
      .addCase(fetchAddonPricing.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAddonPricing.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.addonPricing = payload
      })
      .addCase(fetchAddonPricing.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load addon pricing'
        toast.error(state.error)
      })

      /* -------------------- UPDATE ADDON PRICING -------------------- */
      .addCase(updateAddonPricing.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateAddonPricing.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        const idx = state.addonPricing.findIndex((c) => c.addonName === payload.addonName)
        if (idx !== -1) {
          state.addonPricing[idx] = payload
        } else {
          state.addonPricing.push(payload)
        }
      })
      .addCase(updateAddonPricing.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to update addon pricing'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                            */
/* ------------------------------------------------------------------ */
export const { resetAddonPricingState } = addonPricingSlice.actions
export default addonPricingSlice.reducer
