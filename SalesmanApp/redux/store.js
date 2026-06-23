import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, employee: null, loading: false },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.employee = action.payload.employee;
    },
    clearAuth: (state) => {
      state.token = null;
      state.employee = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const syncSlice = createSlice({
  name: "sync",
  initialState: {
    config: null,
    lastSyncTime: null,
    syncQueue: [],
    isSyncing: false,
  },
  reducers: {
    setConfig: (state, action) => {
      state.config = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    addToQueue: (state, action) => {
      state.syncQueue.push(action.payload);
    },
    clearQueue: (state) => {
      state.syncQueue = [];
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
  },
});

const loadsSlice = createSlice({
  name: "loads",
  initialState: {
    requests: [],
    selectedWarehouse: null,
    pendingCreate: null,
  },
  reducers: {
    setLoads: (state, action) => {
      state.requests = action.payload;
    },
    addLoad: (state, action) => {
      state.requests.push(action.payload);
    },
    updateLoad: (state, action) => {
      const idx = state.requests.findIndex((r) => r.id === action.payload.id);
      if (idx >= 0) state.requests[idx] = action.payload;
    },
    setSelectedWarehouse: (state, action) => {
      state.selectedWarehouse = action.payload;
    },
    setPendingCreate: (state, action) => {
      state.pendingCreate = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export const {
  setConfig,
  setLastSyncTime,
  addToQueue,
  clearQueue,
  setSyncing,
} = syncSlice.actions;
export const {
  setLoads,
  addLoad,
  updateLoad,
  setSelectedWarehouse,
  setPendingCreate,
} = loadsSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sync: syncSlice.reducer,
    loads: loadsSlice.reducer,
  },
});
