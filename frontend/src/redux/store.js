import { configureStore } from '@reduxjs/toolkit';
import searchResultsReducer from './searchResultsSlice';
import singleItemDetailsReducer from './singleItemDetailsSlice';
import similarProductsReducer from './similarProductsSlice';
import googlePhotosReducer from './googlePhotosSlice';
import  wishlistReducer  from './getMongoSlice';
import zipCodeReducer from './zipCodeSlice';

const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    singleItemDetails: singleItemDetailsReducer,
    similarProducts: similarProductsReducer,
    googlePhotos: googlePhotosReducer,
    wishlist: wishlistReducer,
    zipCode: zipCodeReducer,
  },
});

export default store;
