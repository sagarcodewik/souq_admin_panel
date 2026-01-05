import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify';

// Fetch promotions
export const fetchPromotions = createAsyncThunk(
  'promotion/fetchPromotions',
  async ({ page = 1, pageSize = 10, sortKey = 'createdAt', sortDirection = 'desc', isActive }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        limit: pageSize,
        sortKey,
        sortDirection,
      });

      if (isActive !== undefined && isActive !== null && isActive !== '') {
        params.append('isActive', isActive);
      }

      const response = await HttpClient.get(`/promotion/promotions/admin?${params.toString()}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message });
    }
  }
);




// Update promotion status (activate/deactivate)
export const updatePromotionStatus = createAsyncThunk(
  'promotion/updateStatus',
  async (data, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('/promotion/update/status', data)
      toast.success('Promotion status updated successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  },
)

const promotionSlice = createSlice({
  name: 'promotions',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    pageSize: 10,
    currentPage: 1,
    totalRecords: 0,
    sortKey: 'createdAt',
    sortDirection: 'desc',
  },
  reducers: {
    clearPromotions: (state) => {
      state.list = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Promotions
      .addCase(fetchPromotions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Ensure list is always an array
        state.list = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];

        state.totalRecords = action.payload?.totalRecords ?? 0;
        state.currentPage = action.payload?.currentPage ?? 1;
        state.pageSize = action.payload?.pageSize ?? 10;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      // Update Promotion Status
      .addCase(updatePromotionStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload;

        // Update local state
        const index = state.list.findIndex((p) => p._id === id);
        if (index !== -1) {
          state.list[index].isActive = isActive;
        }
      })

  },
});

export const { clearPromotions } = promotionSlice.actions;
export default promotionSlice.reducer;
