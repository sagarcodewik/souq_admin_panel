import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

/* ---------------- THUNKS ---------------- */

export const createSubAdmin = createAsyncThunk(
  'subAdmin/create',
  async (data, { rejectWithValue }) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: 13,
        createdByAdmin: true,
        permissions: data.permissions,
      }

      const res = await HttpClient.post('/user/admin/create-user', payload)

      const { user, permissions } = res.data.data

      toast.success('Sub-admin created successfully')

      return {
        ...user,
        permissions,
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create sub-admin')
      return rejectWithValue(err.response?.data)
    }
  },
)

export const fetchSubAdmins = createAsyncThunk(
  'subAdmin/fetch',
  async ({ page = 1, pageSize = 10, search = '' }, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/user/admin/sub-admins', {
        params: { page, pageSize, search },
      })
      return res.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch sub-admins')
      return rejectWithValue(err.response?.data)
    }
  },
)

export const fetchPermissions = createAsyncThunk(
  'subAdmin/permissions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await HttpClient.get('/user/admin/permissions')
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const updateSubAdmin = createAsyncThunk(
  '/subAdmin/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await HttpClient.patch(`/user/admin/sub-admin/${id}`, data)
      toast.success('Sub-admin updated')
      return { id, data }
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

export const deleteSubAdmin = createAsyncThunk(
  '/subAdmin/delete',
  async (id, { rejectWithValue }) => {
    try {
      await HttpClient.delete(`/user/admin/sub-admin/${id}`)
      toast.success('Sub-admin deleted')
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data)
    }
  },
)

/* ---------------- SLICE ---------------- */

const subAdminSlice = createSlice({
  name: 'subAdmin',
  initialState: {
    list: [],
    permissions: [],
    status: 'idle',
    totalRecords: 0,
    currentPage: 1,
    pageSize: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubAdmins.fulfilled, (state, { payload }) => {
        state.list = payload.data
        state.totalRecords = payload.totalRecords
        state.currentPage = payload.currentPage
        state.pageSize = payload.pageSize
        state.status = 'succeeded'
      })
      .addCase(updateSubAdmin.fulfilled, (state, { payload }) => {
        const { id, data } = payload

        const index = state.list.findIndex((u) => u._id === id)
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...data,
          }
        }
      })
      .addCase(createSubAdmin.fulfilled, (state, { payload }) => {
        state.list.unshift(payload)
        state.totalRecords += 1
      })
      .addCase(fetchPermissions.fulfilled, (state, { payload }) => {
        state.permissions = payload
      })
      .addCase(deleteSubAdmin.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((u) => u._id !== payload)
        state.totalRecords -= 1
      })
  },
})

export default subAdminSlice.reducer
