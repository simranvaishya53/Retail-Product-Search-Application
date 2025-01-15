const express = require('express');
const ItemModel = require('../../items.js');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await ItemModel.find({});
    res.json(items);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;