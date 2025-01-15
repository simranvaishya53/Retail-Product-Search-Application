const express = require('express');
const ItemModel = require('../../items.js');
const router = express.Router();

router.get('/wishlist/remove', async (req, res) => {
    try {
      const { ItemID } = req.query;
      const deletedItem = await ItemModel.findOneAndDelete({ ItemID: ItemID });
      
      if (!deletedItem) {
        res.status(404).json({ message: `Item not found with ID ${ItemID}` });
      } else {
        res.status(200).json({ message: 'Item removed from the wishlist' });
      }
    } catch (error) {
      console.error('Error', error);
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
