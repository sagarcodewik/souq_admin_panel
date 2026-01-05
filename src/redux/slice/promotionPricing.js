// src/redux/slice/promotionPricing.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  ASYNC THUNKS                                                       */
/* ------------------------------------------------------------------ */

// GET promotion pricing
export const fetchPromotionPricing = createAsyncThunk(
  'promotionPricing/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get(`/promotionPricing`)
      console.log('Promotion Pricing:', res.data.data)
      return res.data.data
    } catch (err) {
      console.error('Error fetching promotion pricing:', err)
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

// UPDATE promotion pricing
export const updatePromotionPricing = createAsyncThunk(
  'promotionPricing/update',
  async ({ type, price, pricingType }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post(`/promotionPricing/update`, {
        type,
        price,
        pricingType,
      })
      console.log('Updated Promotion Pricing:', res.data.data)
      toast.success('Promotion Pricing updated successfully')
      return res.data.data
    } catch (err) {
      console.error('Error updating promotion pricing:', err)
      toast.error(err.response?.data?.message ?? 'Failed to update promotion pricing')
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
  promotionPricing: [],
}

/* ------------------------------------------------------------------ */
/*  SLICE                                                              */
/* ------------------------------------------------------------------ */
const promotionPricingSlice = createSlice({
  name: 'promotionPricing',
  initialState,
  reducers: {
    resetPromotionPricingState(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------- FETCH PROMOTION PRICING -------------------- */
      .addCase(fetchPromotionPricing.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPromotionPricing.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.promotionPricing = payload
      })
      .addCase(fetchPromotionPricing.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to load promotion pricing'
        toast.error(state.error)
      })

      /* -------------------- UPDATE PROMOTION PRICING -------------------- */
      .addCase(updatePromotionPricing.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updatePromotionPricing.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        const idx = state.promotionPricing.findIndex((p) => p.type === payload.type)
        if (idx !== -1) {
          state.promotionPricing[idx] = payload
        } else {
          state.promotionPricing.push(payload)
        }
      })
      .addCase(updatePromotionPricing.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to update promotion pricing'
      })
  },
})
export const { resetPromotionPricingState } = promotionPricingSlice.actions
export default promotionPricingSlice.reducer
