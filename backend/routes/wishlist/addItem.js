const express = require('express');
const ItemModel = require('../../items.js');
const router = express.Router();

router.get('/addItem', async (req, res) => {
    let { ItemID, Image, Title, Price, Shipping } = req.query;
  
    let decodedTitle = decodeURIComponent(Title);
    
    // Construct a new document and add it to your MongoDB collection
    let newItem = new ItemModel({
      ItemID,
      Image,
      Title: decodedTitle,
      Price,
      Shipping,
    });
  
    try {
      await newItem.save();
      res.status(200).json({ message: 'Item added to the database' });
    } catch (error) {
      console.error('Error adding item to the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

  });

module.exports = router;
