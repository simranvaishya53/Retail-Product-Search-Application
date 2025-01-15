const express = require('express');
const app = express();
const PORT =  process.env.PORT || 8000;
const cors = require('cors');
const mongoose = require('mongoose');
// Import routes
const addItemRoute = require('./routes/wishlist/addItem');
const removeItemRoute = require('./routes/wishlist/removeItem');
const getWishlistRoute = require('./routes/wishlist/getWishlist');
const getSimilarItemsRoute = require('./routes/getSimilarItems');
const getGoogleImagesRoute = require('./routes/getGoogleImages');
const getAutocompleteZipRoute = require('./routes/getAutocompleteZip');
const getSingleItemRoute = require('./routes/getSingleItem');
const searchItemRoute = require('./routes/searchItem');

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN, // Use the FRONTEND_ORIGIN from .env
}));

const dbURL = process.env.DB_URL; // Use the DB_URL from .env

app.use(cors());
app.use(express.json());

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

mongoose
      .connect(dbURL,connectionParams)
      .then(()=> {
        console.log("Connected to database");
      })
      .catch((err) => {
        console.log("Error connecting to the database", err);
      })

// Use routes
app.use('/wishlist', addItemRoute);
app.use('/wishlist', removeItemRoute);
app.use('/wishlist', getWishlistRoute);
app.use(getSimilarItemsRoute);
app.use(getGoogleImagesRoute);
app.use(getAutocompleteZipRoute);
app.use(getSingleItemRoute);
app.use(searchItemRoute);

// Start the server
app.listen(PORT, () => {
console.log(`Server is running on PORT ${PORT}`);
});
