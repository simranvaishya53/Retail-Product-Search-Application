import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

// Create an async thunk to fetch search results
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}


export const fetchSearchResults = createAsyncThunk(
  'searchResults/fetchSearchResults',
  async (formData, thunkAPI) => {
    try {
     
      const queryParams = `formData=${JSON.stringify(formData)}`;
      const response = await Axios.get(`${BASE_URL}/search-ebay?${queryParams}`);
      console.log("response", response.data.parsedItems);
      return response.data.parsedItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



// Create the search results slice
const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the action creator for clearing search results
export const { clearSearchResults } = searchResultsSlice.actions;
export default searchResultsSlice.reducer;
