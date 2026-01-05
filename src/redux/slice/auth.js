import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import HttpClient from '../../helper/http-client'
import { toast } from 'react-toastify'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.post('/user/login', {
        email,
        password,
        role: Number(process.env.REACT_APP_ROLE || 10),
      })
      console.log('Login response:', response.data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: err.message })
    }
  },
)

const initialState = {
  email: null,
  token: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.email = null
      state.token = null
      state.status = 'idle'
      state.error = null
      localStorage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { token, user } = payload.data
        state.status = 'succeeded'
        state.email = user.email
        state.token = token
        localStorage.setItem('token', token)
        toast.success('Login successful!')
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload?.message ?? 'Login failed'
        toast.error(state.error)
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
