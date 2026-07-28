import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const runLogAgent = createAsyncThunk(
  'ai/logComplaint',
  async (prompt, { rejectWithValue }) => {
    try {
      // POST with JSON body — NOT query param — avoids URL length/encoding issues
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
    const handlePending   = (state)         => { state.loading = true; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.riskAssessment = action.payload.risk_assessment || null;
      state.processingNotes = action.payload.processing_notes || [];
    };
    const handleRejected  = (state, action) => {
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
