// slices/zipCodeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  suggestions: null,
  status: 'idle',
  error: null,
};

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Define an async thunk to fetch ZIP code data
export const fetchZipCode = createAsyncThunk('zipCode/fetchZipCode', async (zipCode) => {
  const apiUrl = `${BASE_URL}/autocomplete-zip`; // Replace with your API URL
  const fullApiUrl = new URL(apiUrl);
  fullApiUrl.searchParams.append('zipPrefix', zipCode);

  const response = await fetch(fullApiUrl, {
    method: 'GET',
    headers: {
      // Include any necessary headers here
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json(); // This parses the response body as JSON
  return data.suggestions;
});

// Create a slice for the ZIP code data
const zipCodeSlice = createSlice({
  name: 'zipCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchZipCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchZipCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suggestions = action.payload;
        state.error = null;
      })
      .addCase(fetchZipCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default zipCodeSlice.reducer;
