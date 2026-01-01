import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AlertState, Alert, CreateAlertRequest } from '../types';
import { alertService } from '../services/alertService';

const initialState: AlertState = {
  alerts: [],
  currentAlert: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      return await alertService.getAlerts();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlertById = createAsyncThunk(
  'alerts/fetchAlertById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await alertService.getAlertById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAlert = createAsyncThunk(
  'alerts/createAlert',
  async (data: CreateAlertRequest, { rejectWithValue }) => {
    try {
      return await alertService.createAlert(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAlert = createAsyncThunk(
  'alerts/updateAlert',
  async ({ id, data }: { id: string; data: Partial<CreateAlertRequest> }, { rejectWithValue }) => {
    try {
      return await alertService.updateAlert(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/deleteAlert',
  async (id: string, { rejectWithValue }) => {
    try {
      await alertService.deleteAlert(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearCurrentAlert: (state) => {
      state.currentAlert = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all alerts
    builder.addCase(fetchAlerts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAlerts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.alerts = action.payload;
    });
    builder.addCase(fetchAlerts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch alert by ID
    builder.addCase(fetchAlertById.fulfilled, (state, action) => {
      state.currentAlert = action.payload;
    });

    // Create alert
    builder.addCase(createAlert.fulfilled, (state, action) => {
      state.alerts.unshift(action.payload);
    });

    // Update alert
    builder.addCase(updateAlert.fulfilled, (state, action) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = action.payload;
      }
      if (state.currentAlert?.id === action.payload.id) {
        state.currentAlert = action.payload;
      }
    });

    // Delete alert
    builder.addCase(deleteAlert.fulfilled, (state, action) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
      if (state.currentAlert?.id === action.payload) {
        state.currentAlert = null;
      }
    });
  },
});

export const { clearCurrentAlert, clearError } = alertSlice.actions;
export default alertSlice.reducer;