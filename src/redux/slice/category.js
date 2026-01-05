import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch all categories (GET /category/getCategory)
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  // in fetchCategories.js
  async ({ page = 1, pageSize = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/category/getCategory', {
        params: { page, pageSize, search },
      })
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Create a new category (POST /category/create)
 */
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (newCategory, { rejectWithValue }) => {
    try {
      const res = await HttpClient.post('/category/create', newCategory)
      toast.success('Category created successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Update a category (PATCH /category/updateCategory/:id)
 */
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, updatedData }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.patch(`/category/updateCategory/${categoryId}`, updatedData)
      toast.success('Category updated successfully.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Delete a category (DELETE /category/deleteCategory/:id)
 */
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/category/deleteCategory/${categoryId}`)
      toast.success('Category deleted successfully.')
      return categoryId
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  categories: [],
  status: 'idle',
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,

  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories(state) {
      state.categories = []
      state.status = 'idle'
      state.error = null
      state.totalRecords = 0
      state.currentPage = 1
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH CATEGORIES ---------- */
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.categories = payload.data
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch categories'
      })

      /* ---------- CREATE CATEGORY ---------- */
      .addCase(createCategory.pending, (state) => {
        state.createStatus = 'loading'
      })
      .addCase(createCategory.fulfilled, (state, { payload }) => {
        state.createStatus = 'succeeded'
        state.categories.unshift(payload) // add new category at top
        state.totalRecords += 1
      })
      .addCase(createCategory.rejected, (state) => {
        state.createStatus = 'failed'
      })

      /* ---------- UPDATE CATEGORY ---------- */
      .addCase(updateCategory.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.updateStatus = 'succeeded'
        const idx = state.categories.findIndex((c) => c._id === payload._id)
        if (idx !== -1) state.categories[idx] = payload
      })
      .addCase(updateCategory.rejected, (state) => {
        state.updateStatus = 'failed'
      })

      /* ---------- DELETE CATEGORY ---------- */
      .addCase(deleteCategory.pending, (state) => {
        state.deleteStatus = 'loading'
      })
      .addCase(deleteCategory.fulfilled, (state, { payload: id }) => {
        state.deleteStatus = 'succeeded'
        state.categories = state.categories.filter((c) => c._id !== id)
        state.totalRecords -= 1
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.deleteStatus = 'failed'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearCategories } = categorySlice.actions
export default categorySlice.reducer
