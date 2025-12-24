const mongoose = require('mongoose');

const womenProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});

const womenProduct = mongoose.model('womenproduct', womenProductSchema);

module.exports = womenProduct;
