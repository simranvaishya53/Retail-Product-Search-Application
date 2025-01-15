const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    ItemID: String,
    Image: String,
    Title: String,
    Price: String,
    Shipping: String
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;