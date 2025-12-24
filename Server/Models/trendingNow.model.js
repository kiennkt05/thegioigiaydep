const mongoose = require('mongoose');

const trendingNowSchema = new mongoose.Schema({
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
        // required: true,
    },
    category: {
        type: String,
        required: true,
    }
});

const trendingNowModel = mongoose.model('trendingnow', trendingNowSchema);

module.exports = trendingNowModel;
