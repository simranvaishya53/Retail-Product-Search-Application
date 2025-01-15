const express = require('express');
const axios = require('axios');
const router = express.Router();
const OAuthToken = require('../OAuthToken');

router.get('/getSingleItem', async (req, res) => {
    console.log("Inside get single item api call");
    // console.log("Request", req.query);
    const { itemId } = req.query;
  try {
      const client_id = 'SimranVa-myapplic-PRD-aaff83e1f-46069887';
      const client_secret = 'PRD-aff83e1f79e7-6642-4aba-a595-8675';
      
      // Create an instance of the OAuthToken class
      const oauth_utility = new OAuthToken(client_id, client_secret);

      // Get the application token
      const application_token = await oauth_utility.getApplicationToken();

      // Set the request headers
      const headers = {
      'X-EBAY-API-IAF-TOKEN': application_token,
      };

      // console.log("Application Token", application_token);

      // Make the GET request to the eBay API
      const get_single_item_url = `https://open.api.ebay.com/shopping?` +
      `callname=GetSingleItem&` +
      `responseencoding=JSON&` +
      `appid=${client_id}&` +
      `siteid=0&` +
      `version=967&` +
      `ItemID=${itemId}&` +
      `IncludeSelector=Description,Details,ItemSpecifics`;

      // print the constructed URL
      // console.log("API URL", get_single_item_url);
      const response = await axios.get(get_single_item_url, { headers });

      // Handle the API response (e.g., parse JSON response and extract item details)
      if (response.status === 200) {
        const item_data = response.data.Item;

        // Extract the item details
        const ItemId = item_data?.ItemID || null;
        const productImages = item_data?.PictureURL || null;
        const price = (item_data?.CurrentPrice && item_data.CurrentPrice.Value) || null;
        const location = item_data?.Location || null;
        const returnAccepted = item_data?.ReturnPolicy?.ReturnsAccepted || null;
        const returnWithin = item_data?.ReturnPolicy?.ReturnsWithin || null;
        const title = item_data?.Title || null;
        // Extract seller information
        const feedbackScore = item_data?.Seller?.FeedbackScore || null;
        const popularity = item_data?.Seller?.PositiveFeedbackPercent || null;
        const feedbackratingstar = item_data?.Seller?.FeedbackRatingStar || null;
        const topratedseller = item_data?.Seller?.TopRatedSeller || null;
        // const storeFront = item_data.Storefront || null;
        const storename = item_data?.Storefront?.StoreName || null;
        const storeurl = item_data?.Storefront?.StoreURL || null;
        const viewitemurlfornaturalsearch = item_data?.ViewItemURLForNaturalSearch || null;


        // Extract item specifics
        let itemSpecifics = [];

        if (item_data && item_data.ItemSpecifics && item_data.ItemSpecifics.NameValueList) {
            const nameValueList = item_data.ItemSpecifics.NameValueList;

            if (Array.isArray(nameValueList)) {
                itemSpecifics = nameValueList
                    .filter(item => item.Name && item.Value) // Filter out items with missing Name or Value
                    .map(item => ({
                        name: item.Name,
                        value: item.Value,
                    }));
            }
        }

        // Construct an object containing the extracted data
        const itemDetails = {
            ItemId,
            productImages,
            price,
            location,
            returnAccepted,
            returnWithin,
            itemSpecifics,
            ...(feedbackScore && { feedbackScore }),
            ...(popularity && { popularity }),
            ...(feedbackratingstar && { feedbackratingstar }),
            ...(topratedseller && { topratedseller }),
            ...(storename && { storename }),
            ...(storeurl && { storeurl }),
            title,
            viewitemurlfornaturalsearch,
        };

        res.json({ itemDetails });
    } else {
        res.status(500).json({ error: 'API request failed' });
        }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;