
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Helper — converts FastAPI error to readable string
function parseError(err) {
  const detail = err.response?.data?.detail;
  if (!detail) return err.message || 'Something went wrong';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(', ');
  return JSON.stringify(detail);
}

export const fetchComplaints = createAsyncThunk(
  'complaints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/complaints/');
      return response.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/complaints/', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/complaints/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: [],
    currentComplaint: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentComplaint: (state, action) => {
      state.currentComplaint = action.payload;
    },
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state.currentComplaint) {
        state.currentComplaint[field] = value;
      } else {
        state.currentComplaint = { [field]: value };
      }
    },
    setFormData: (state, action) => {
      state.currentComplaint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        // Always a string now — never an object
        state.error = action.payload || 'Failed to fetch complaints';
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.currentComplaint = action.payload;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create complaint';
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        const idx = state.items.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.currentComplaint = action.payload;
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update complaint';
      });
  }
});

export const {
  setCurrentComplaint,
  updateFormField,
  setFormData
} = complaintSlice.actions;

export default complaintSlice.reducer;
