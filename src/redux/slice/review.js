import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

//  Get Products with Reviews and Ratings
export const fetchProductsWithReviews = createAsyncThunk(
  'review/fetchProductsWithReviews',
  async ({ search = '', sort = 'latest' } = {}, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/review/getOnlyProductsWithReviewsAndRatings', {
        params: {
          search,
          sort,
        },
      })
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch reviews.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  }
)



/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  list: [],
  loading: false,
  error: null,
}

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews(state) {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsWithReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsWithReviews.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload
      })
      .addCase(fetchProductsWithReviews.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload?.message || 'Failed to fetch reviews'
      })
  },
})

export const { clearReviews } = reviewSlice.actions
export default reviewSlice.reducer
