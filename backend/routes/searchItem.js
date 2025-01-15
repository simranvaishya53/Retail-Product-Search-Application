const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search-ebay', async (req, res) => {

    try {
  
      const formData = req.query.formData;
      const {
        keyword,
        distance,
        zipCode,
        shippingOptions,
        conditions,
      } = JSON.parse(formData);
  
      // Extract shipping options
      const FreeShippingOnly = shippingOptions.includes('freeShipping');
      const LocalPickupOnly = shippingOptions.includes('localPickup');
      const HideDuplicateItems = true; // Set to true if you want to hide duplicate items
      
      // Define the base parameters
      const baseParams = {
        'OPERATION-NAME': 'findItemsAdvanced',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': process.env.EBAY_APP_ID,  // Replace with your eBay App ID
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'paginationInput.entriesPerPage': 50,
        
        'keywords': keyword,
        'buyerPostalCode': zipCode,
        
      };
  
      // Create a list to hold item filter parameters
      const itemFilterParams = [];
  
      // Add item filters based on user selections
      let filterCount = 0;
  
      if (distance) {
        itemFilterParams.push(`itemFilter(${filterCount}).name=MaxDistance`);
        itemFilterParams.push(`itemFilter(${filterCount}).value=${distance}`);
        filterCount++;
      }
  
      if (FreeShippingOnly) {
        itemFilterParams.push(`itemFilter(${filterCount}).name=FreeShippingOnly`);
        itemFilterParams.push(`itemFilter(${filterCount}).value=true`);
        filterCount++;
      }
  
      if (LocalPickupOnly) {
        itemFilterParams.push(`itemFilter(${filterCount}).name=LocalPickupOnly`);
        itemFilterParams.push(`itemFilter(${filterCount}).value=true`);
        filterCount++;
      }
  
      if (HideDuplicateItems) {
        itemFilterParams.push(`itemFilter(${filterCount}).name=HideDuplicateItems`);
        itemFilterParams.push(`itemFilter(${filterCount}).value=true`);
        filterCount++;
      }
  
      const conditionMapping = {
        'new': 'New',
        'used': 'Used',
        'unspecified': 'Unspecified'
      };
  
      const customConditions = [];
      let conditionIndex = 0;
  
      for (const condition of conditions) {
        if (condition !== 'Unspecified') {
          if (condition in conditionMapping) {
            customConditions.push(conditionMapping[condition]);
          }
        }
      }
  
      if (customConditions.length > 0) {
        itemFilterParams.push(`itemFilter(${filterCount}).name=Condition`);
        customConditions.forEach((conditionValue, index) => {
          itemFilterParams.push(`itemFilter(${filterCount}).value(${index})=${conditionValue}`);
        });
        filterCount++;
      }
  
      // Combine base parameters and item filter parameters into an object
      const allParams = {
        ...baseParams
      };
  
      for (const param of itemFilterParams) {
        const [key, value] = param.split('=');
        allParams[key] = value;
      }
  
      // Construct the query string
      const queryString = Object.keys(allParams)
        .map(key => `${key}=${allParams[key]}`)
        .join('&');
  
      // Construct the API URL
      var apiURL = `https://svcs.ebay.com/services/search/FindingService/v1?${queryString}`;
      apiURL += '&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
  
      // Make the API request
      const response = await axios.get(apiURL);
      if (response.status === 200) {
        const ebayData = response.data;
        
  
        // Initialize an array to store the parsed items
        const parsedItems = [];
        
        // Check if the eBay API response structure is valid
        if ( ebayData.findItemsAdvancedResponse && Array.isArray(ebayData.findItemsAdvancedResponse)) {
            const findItemsResponse = ebayData.findItemsAdvancedResponse[0];
        
            if (findItemsResponse && findItemsResponse.searchResult) {
            const searchResult = findItemsResponse.searchResult[0];
        
            if (searchResult && searchResult.item) {
                const responseItems = Array.isArray(searchResult.item)
                ? searchResult.item
                : [];
        
                // Initialize an index starting from 1
                let index = 1;
        
                // Loop through the items and extract the required information
                for (const item of responseItems) {
                const parsedItem = {
                    Index: index, // Assign the index starting from 1
                    ItemId: item.itemId && item.itemId[0] ? item.itemId[0] : 'N/A',
                    Title: item.title && item.title[0] ? item.title[0] : 'N/A',
                };
        
                // Extract the Price information
                if (item.sellingStatus && item.sellingStatus[0]) {
                    const currentPrice = item.sellingStatus[0].convertedCurrentPrice;
                    parsedItem.Price =
                    currentPrice && currentPrice[0] && currentPrice[0].__value__
                        ? currentPrice[0].__value__
                        : 'N/A';
                } else {
                    parsedItem.Price = 'N/A';
                }
                
                // Extract the Shipping information
                if (item.shippingInfo && item.shippingInfo[0]) {
                    const shippingCost = item.shippingInfo[0].shippingServiceCost;
                    if (shippingCost && shippingCost[0]) {
                    const shippingValue = shippingCost[0].__value__;
                    parsedItem.Shipping =
                        shippingValue === '0.0'
                        ? 'Free Shipping'
                        : `$${shippingValue}`;
                    } else {
                    parsedItem.Shipping = 'N/A';
                    }
                } else {
                    parsedItem.Shipping = 'N/A';
                }
        
        
                // Extract the Item zip code
                parsedItem.Zip = item.postalCode && item.postalCode[0] ? item.postalCode[0] : 'N/A';
        
                // Extract the Image from the galleryURL
                if (item.galleryURL && item.galleryURL[0]) {
                    parsedItem.Image = item.galleryURL[0];
                } else {
                    parsedItem.Image = 'N/A';
                }
        
                // Extract shipping location
                if(item.shippingInfo && item.shippingInfo[0] && item.shippingInfo[0].shipToLocations) {
                    parsedItem.ShippingLocation = item.shippingInfo[0].shipToLocations[0];
                } else {
                    parsedItem.ShippingLocation = null;
                }
        
                // extract handling time
                if(item.shippingInfo && item.shippingInfo[0] && item.shippingInfo[0].handlingTime) {
                    parsedItem.HandlingTime = item.shippingInfo[0].handlingTime[0];
                }else {
                    parsedItem.HandlingTime = null;
                }
        
                // extract expedited shipping
                if(item.shippingInfo && item.shippingInfo[0] && item.shippingInfo[0].expeditedShipping) {
                    parsedItem.ExpeditedShipping = item.shippingInfo[0].expeditedShipping[0];
                }else {
                    parsedItem.ExpeditedShipping = null;
                }
        
                // extract one day shipping
                if(item.shippingInfo && item.shippingInfo[0] && item.shippingInfo[0].oneDayShippingAvailable) {
                    parsedItem.OneDayShippingAvailable = item.shippingInfo[0].oneDayShippingAvailable[0];
                }else {
                    parsedItem.OneDayShippingAvailable = null;
                }
        
                // extract returns accepted
                if(item.returnsAccepted) {
                    parsedItem.ReturnsAccepted = item.returnsAccepted[0];
                }
                else {
                    parsedItem.ReturnsAccepted = null;
                }
        
                // Push the parsed item to the array
                parsedItems.push(parsedItem);
        
                // Increment the index for the next item
                index++;
                }
            }
            }
        }
        
        // Now, parsedItems contains the parsed data with "Index" values starting from 1
        // console.log(parsedItems);
        res.json({ parsedItems });
  
      } else {
        res.status(500).json({ error: 'API request failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;  