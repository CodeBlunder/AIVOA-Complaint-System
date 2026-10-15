
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Date sanitizer ───────────────────────────────────────────────────────────
// LLMs sometimes return dates as "Mar 2026" or "15-03-2026"
// HTML date inputs require strictly "yyyy-MM-dd"
function sanitizeDates(formData) {
  if (!formData) return formData;
  const dateFields = ['manufacturing_date', 'expiry_date', 'date_received'];
  const cleaned = { ...formData };
  dateFields.forEach(field => {
    if (cleaned[field]) {
      const val = cleaned[field];
      // Already correct format — leave it alone
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return;
      // Try to parse and reformat
      const parsed = new Date(val);
      cleaned[field] = !isNaN(parsed.getTime())
        ? parsed.toISOString().split('T')[0]
        : '';  // Can't parse — clear it
    }
  });
  return cleaned;
}

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const runLogAgent = createAsyncThunk(
  'ai/logComplaint',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/log-complaint', { prompt });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const runEditAgent = createAsyncThunk(
  'ai/editComplaint',
  async ({ complaintId, instruction, currentData }, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/edit-complaint', {
        complaint_id: complaintId,
        edit_instruction: instruction,
        current_data: currentData,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

export const runExtractAgent = createAsyncThunk(
  'ai/extractDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/extract-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    loading: false,
    riskAssessment: null,
    processingNotes: [],
    error: null,
  },
  reducers: {
    clearAIState: (state) => {
      state.riskAssessment = null;
      state.error = null;
      state.processingNotes = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      // Sanitize dates before storing — prevents HTML date input errors
      if (action.payload.form_data) {
        action.payload.form_data = sanitizeDates(action.payload.form_data);
      }
      state.riskAssessment = action.payload.risk_assessment || null;
      state.processingNotes = action.payload.processing_notes || [];
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    };

    builder
      .addCase(runLogAgent.pending,       handlePending)
      .addCase(runLogAgent.fulfilled,     handleFulfilled)
      .addCase(runLogAgent.rejected,      handleRejected)
      .addCase(runEditAgent.pending,      handlePending)
      .addCase(runEditAgent.fulfilled,    handleFulfilled)
      .addCase(runEditAgent.rejected,     handleRejected)
      .addCase(runExtractAgent.pending,   handlePending)
      .addCase(runExtractAgent.fulfilled, handleFulfilled)
      .addCase(runExtractAgent.rejected,  handleRejected);
  },
});

export const { clearAIState } = aiSlice.actions;
export default aiSlice.reducer;