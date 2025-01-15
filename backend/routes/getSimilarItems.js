const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/getSimilarItems', async (req, res) => {
  try {
  
            const { itemId } = req.query;
            const apiUrl = 'https://svcs.ebay.com/MerchandisingService';
            const operationName = 'getSimilarItems';
            const serviceName = 'MerchandisingService';
            const serviceVersion = '1.1.0';
            const consumerId = process.env.EBAY_APP_ID; // eBay App ID
            const responseDataFormat = 'JSON';
            const maxResults = 20;
  
            const SMurl = `${apiUrl}?OPERATION-NAME=${operationName}&SERVICE-NAME=${serviceName}&SERVICE-VERSION=${serviceVersion}&CONSUMER-ID=${consumerId}&RESPONSE-DATA-FORMAT=${responseDataFormat}&REST-PAYLOAD&itemId=${itemId}&maxResults=${maxResults}`;
            const response = await axios.get(SMurl);

            if(response.status === 200) {
              const similarItems = response.data.getSimilarItemsResponse.itemRecommendations.item;

              // Create an array to store the parsed similar items
              const parsedSimilarItems = [];
    
              // Iterate through the similar items
              similarItems.forEach((item) => {
              // Define an object to store the relevant fields
              const parsedItem = {};
    
              // Check if each field exists before appending it
              if (item.itemId) {
                parsedItem.itemId = item.itemId;
              }
              if (item.title) {
                parsedItem.productName = item.title;
              }
              if (item.viewItemURL) {
                parsedItem.itemURL = item.viewItemURL;
              }
              if (item.buyItNowPrice && item.buyItNowPrice.__value__) {
                parsedItem.price = item.buyItNowPrice.__value__;
              }
              if (item.shippingCost && item.shippingCost.__value__) {
                parsedItem.shippingCost = item.shippingCost.__value__;
              }
              if (item.timeLeft) {
                const daysLeftMatch = item.timeLeft.match(/P(\d+)D/);
                if (daysLeftMatch) {
                  parsedItem.daysLeft = daysLeftMatch[1];
                }
              }
              if (item.imageURL) {
                parsedItem.imageURL = item.imageURL;
              }
    
              // Append the parsed item to the array
              parsedSimilarItems.push(parsedItem);
  
          });
            res.json({ parsedSimilarItems });
            } 
            else {
              res.status(500).json({ error: 'API request failed' });
              }
        } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;