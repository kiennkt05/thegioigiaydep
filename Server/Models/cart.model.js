const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Can be a UUID for guests or ObjectID for auth users
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            title: { type: String, required: true }, // Snapshot of title
            price: { type: Number, required: true }, // Snapshot of price at time of add
            image: { type: String, required: true },
            size: { type: String, required: true },
            color: { type: String },
            sku: { type: String }, // Optional, helpful for variant tracking
            quantity: { type: Number, required: true, min: 1, default: 1 }
        }
    ],
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp on save
cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
