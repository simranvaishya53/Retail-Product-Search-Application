const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/getGoogleImages', async (req, res) => {
    try {
            const {Title} = req.query;
            const searchEngineId = process.env.SEARCH_ENGINE_ID; // Fetch from environment variables
            const apiKey = process.env.GOOGLE_API_KEY; // Fetch from environment variables
  
            // Construct the URL
            const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(Title)}&cx=${searchEngineId}&imgSize=huge&num=8&searchType=image&key=${apiKey}`;
  
            const response = await axios.get(url)
            if(response.status === 200) {
              const googleImages = response.data.items;
  
              const parsedGoogleImages = [];
  
              // Iterate through the google images
              googleImages.forEach((item) => {
                // Define an object to store the relevant fields
                const parsedItem = {};
  
                // Check if each field exists before appending it
                if (item.link) {
                  parsedItem.link = item.link;
                }
                else {
                  parsedItem.link = null;
                }
  
                // Append the parsed item to the array
                parsedGoogleImages.push(parsedItem);
  
              });
  
              res.json({ parsedGoogleImages });
            } else {
              res.status(500).json({ error: 'API request failed' });
              }
  
        }   catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
});

module.exports = router;