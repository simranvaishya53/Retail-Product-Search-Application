import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';

// Define the initial state of your wishlist slice
const initialState = {
  wishlistBucket: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Create an async thunk for adding an item to the wishlist
export const getFromWishlist = createAsyncThunk(
  'wishlist/getFromWishlist',
  async (thunkAPI) => {
    try {
      const response = await Axios.get(`${BASE_URL}/wishlist`);

      return response.data; // this will be the `fulfilled` action payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // this will be the `rejected` action payload
    }
  }
);

// Create a slice for the wishlist
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(getFromWishlist.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getFromWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("successive");
        state.wishlistBucket = action.payload;
      })
      .addCase(getFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the action creators and reducer

export default wishlistSlice.reducer;
