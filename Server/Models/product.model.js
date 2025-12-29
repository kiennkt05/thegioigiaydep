const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // e.g., "Shoes", "Clothing"
    gender: { type: String, enum: ['men', 'women', 'kids', 'unisex'], required: true },
    images: [{ type: String }],
    variants: [{
        size: String,
        width: String,
        color: String,
        sku: { type: String, unique: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        warehouseId: { type: String, default: 'WH-MAIN' },
        deliverySLA: {
            type: String,
            enum: ['4H', '24H', '48H'],
            default: '24H',
            index: true
        }
    }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    style_tags: [String], // ["Athletic", "Casual", "Streetwear"]
    fit_recommendation: {
        type: String,
        enum: ['Runs Small', 'True to Size', 'Runs Large'],
        default: 'True to Size'
    }
}, { timestamps: true });

productSchema.index({
    title: 'text',
    brand: 'text',
    category: 'text',
    tags: 'text'
}, {
    weights: {
        title: 10,
        brand: 5,
        category: 3,
        tags: 1
    },
    name: "ProductSearchIndex"
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
