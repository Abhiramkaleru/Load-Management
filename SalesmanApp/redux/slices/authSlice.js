import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../api/apiClient";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/login", credentials);

      // SAVE TOKEN LOCALLY
      await AsyncStorage.setItem("token", res.data.token);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

// LOAD SESSION (AUTO LOGIN)
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) return null;

    return { token };
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOAD SESSION
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
