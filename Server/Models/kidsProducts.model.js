const mongoose = require('mongoose');

const kidsProductSchema = new mongoose.Schema({
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

const kidsProduct = mongoose.model('kidsproduct', kidsProductSchema);

module.exports = kidsProduct;
