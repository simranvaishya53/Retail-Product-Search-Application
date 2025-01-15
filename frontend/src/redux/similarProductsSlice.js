import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const initialState = {
  itemSM: null,
  status: 'idle',
  error: null,
}

// Create an async thunk to fetch single item details
export const fetchSimilarProducts = createAsyncThunk(
  'similarProducts/fetchSimilarProducts',
  async (itemId, thunkAPI) => {
    try {
      const response = await Axios.get(`${BASE_URL}/getSimilarItems`, {
        params: {
          itemId,
        },
      });
      return response.data.parsedSimilarItems;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create the single item details slice
const similarProductsSlice = createSlice({
  name: 'similarProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.itemSM = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default similarProductsSlice.reducer;
