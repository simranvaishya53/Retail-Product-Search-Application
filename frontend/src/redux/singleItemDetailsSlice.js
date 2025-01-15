import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const initialState = {
  item: null,
  status: 'idle',
  error: null,
}

// Create an async thunk to fetch single item details
export const fetchSingleItemDetails = createAsyncThunk(
  'singleItemDetails/fetchSingleItemDetails',
  async (itemId, thunkAPI) => {
    try {
      const response = await Axios.get(`${BASE_URL}/getSingleItem`, {
        params: {
          itemId,
        },
      });
      return response.data.itemDetails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create the single item details slice
const singleItemDetailsSlice = createSlice({
  name: 'singleItemDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleItemDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleItemDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchSingleItemDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default singleItemDetailsSlice.reducer;
