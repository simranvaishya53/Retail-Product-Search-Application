import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const initialState = {
  photos: null,
  status: 'idle',
  error: null,
}

// Create an async thunk to fetch single item details
export const fetchGooglePhotos = createAsyncThunk(
  'googlePhotos/fetchGooglePhotos',
  async (Title, thunkAPI) => {
    try {
      const response = await Axios.get(`${BASE_URL}/getGoogleImages`, {
        params: {
            Title,
        },
      });
      return response.data.parsedGoogleImages;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create the single item details slice
const googlePhotosSlice = createSlice({
  name: 'googlePhotos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGooglePhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGooglePhotos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.photos = action.payload;
      })
      .addCase(fetchGooglePhotos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default googlePhotosSlice.reducer;
