// src/redux/slice/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ------------------------------------------------------------------ */
/*  THUNKS                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch products (admin ↔︎ POST /product/).
 *
 *  – page          (default 1)
 *  – pageSize      (default 10)
 *  – sortKey       (default createdAt)
 *  – sortDirection (default desc)
 *  – vendorId      (optional)  ➜ only if you want to filter by vendor
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      page = 1,
      pageSize = 10,
      sortKey = 'createdAt',
      sortDirection = 'desc',
      vendorId = undefined, // Optional filter
      search,
      categoryName,
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await HttpClient.post('/product', {
        page,
        pageSize,
        sortKey,
        sortDirection,
        vendorId,
        search,
        categoryName,
      })

      /* Controller returns:
         { data, totalRecords, currentPage, pageSize }
      */
      console.log('Products fetched:', res.data.data)
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch products.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Delete a product (assumes DELETE /product/:id).
 */
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/product/${productId}`)
      toast.success('Product deleted.')
      return productId
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/**
 * Update a product (assumes PUT /product/:id).
 */
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.put(`/product/${productId}`, updatedData)
      toast.success('Product updated.')
      return res.data.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product.')
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

/* ------------------------------------------------------------------ */
/*  SLICE                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  products: [],
  status: 'idle',
  error: null,

  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,

  deleteStatus: 'idle',
  updateStatus: 'idle',
  selectedProductId: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts(state) {
      state.products = []
      state.status = 'idle'
      state.error = null
      state.totalRecords = 0
      state.currentPage = 1
    },
    setSelectedProductId(state, { payload }) {
      state.selectedProductId = payload
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH PRODUCTS ---------- */
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.products = payload.data
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Failed to fetch products'
      })

      /* ---------- DELETE PRODUCT ---------- */
      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = 'loading'
      })
      .addCase(deleteProduct.fulfilled, (state, { payload: id }) => {
        state.deleteStatus = 'succeeded'
        state.products = state.products.filter((p) => p._id !== id)
        state.totalRecords -= 1
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deleteStatus = 'failed'
      })

      /* ---------- UPDATE PRODUCT ---------- */
      .addCase(updateProduct.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.updateStatus = 'succeeded'
        const idx = state.products.findIndex((p) => p._id === payload._id)
        if (idx !== -1) state.products[idx] = payload
      })
      .addCase(updateProduct.rejected, (state) => {
        state.updateStatus = 'failed'
      })
  },
})

/* ------------------------------------------------------------------ */
/*  EXPORTS                                                           */
/* ------------------------------------------------------------------ */

export const { clearProducts, setSelectedProductId } = productSlice.actions
export default productSlice.reducer
