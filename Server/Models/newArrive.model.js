const mongoose = require('mongoose')

const newArrivalSchema = new mongoose.Schema({
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

const newArrivalModel = mongoose.model('newarrival', newArrivalSchema);

module.exports = newArrivalModel;
