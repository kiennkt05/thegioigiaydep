const mongoose = require('mongoose');

const specialProductSchema = new mongoose.Schema({
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
    }
});

const SpecialProduct = mongoose.model('SpecialProduct', specialProductSchema);

module.exports = SpecialProduct;
