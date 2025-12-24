const mongoose = require('mongoose')

const menProductSchema = new mongoose.Schema({
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

const menProduct = mongoose.model('mensProduct', menProductSchema);

module.exports = menProduct;
