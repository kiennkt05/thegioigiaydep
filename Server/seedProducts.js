const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./Models/product.model');

const seedData = [
    {
        title: "Classic Canvas Sneaker",
        brand: "Zappos Essentials",
        description: "A timeless classic for everyday wear. Comfortable and stylish canvas upper with a durable rubber sole.",
        category: "Shoes",
        gender: "men",
        images: ["https://m.media-amazon.com/images/I/71Y7p-I6qzL._AC_UY695_.jpg"],
        variants: [
            { size: "9", width: "D - Medium", color: "Black", sku: "SNEAK-BLK-09", price: 49.95, stock: 25 },
            { size: "10", width: "D - Medium", color: "Black", sku: "SNEAK-BLK-10", price: 49.95, stock: 30 }
        ],
        rating: 4.5,
        reviewCount: 128,
        tags: ["sneakers", "casual", "canvas"]
    },
    {
        title: "Athletic Running Shoe",
        brand: "Zappos Sport",
        description: "High-performance running shoe with breathable mesh and superior cushioning for long distance runs.",
        category: "Shoes",
        gender: "women",
        images: ["https://m.media-amazon.com/images/I/71v-s77549L._AC_UY695_.jpg"],
        variants: [
            { size: "7", width: "B - Medium", color: "Blue/Pink", sku: "RUN-BLP-07", price: 89.99, stock: 15 },
            { size: "8", width: "B - Medium", color: "Blue/Pink", sku: "RUN-BLP-08", price: 89.99, stock: 20 }
        ],
        rating: 4.8,
        reviewCount: 54,
        tags: ["running", "sport", "breathable"]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Insert seed data
        await Product.insertMany(seedData);
        console.log('Seed data inserted successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
