import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const EMPTY_FORM = {
  complainant_name: '',
  complainant_company: '',
  complainant_email: '',
  complainant_phone: '',
  product_name: '',
  batch_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  date_received: '',
  category: '',
  description: '',
  severity: '',
  assigned_to: '',
  status: 'Open',
  source: 'Manual',
};

export const fetchComplaints = createAsyncThunk(
  'complaints/fetch',
  async () => {
    const res = await api.get('/complaints/');
    return res.data;
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/create',
  async (data) => {
    const res = await api.post('/complaints/', data);
    return res.data;
  }
);

export const updateComplaint = createAsyncThunk(
  'complaints/update',
  async ({ id, data }) => {
    const res = await api.put(`/complaints/${id}`, data);
    return res.data;
  }
);

const complaintSlice = createSlice({
  name: 'complaints',

  initialState: {
    items: [],
    currentComplaint: EMPTY_FORM,
    loading: false,
    error: null,
  },

  reducers: {

    setFormData(state, action) {
      state.currentComplaint = {
        ...EMPTY_FORM,
        ...action.payload,
      };
    },

    updateFormField(state, action) {
      const { field, value } = action.payload;
      state.currentComplaint[field] = value;
    },

    setCurrentComplaint(state, action) {
      state.currentComplaint = action.payload;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(createComplaint.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.currentComplaint = {
          ...EMPTY_FORM,
        };
      })

      .addCase(updateComplaint.fulfilled, (state, action) => {

        const index = state.items.findIndex(
          c => c.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        state.currentComplaint = action.payload;
      });

  },
});

export const {
  updateFormField,
  setCurrentComplaint,
  setFormData,
} = complaintSlice.actions;

export default complaintSlice.reducer;