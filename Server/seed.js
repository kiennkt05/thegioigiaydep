require('dotenv').config({ path: './Server/.env' });
const path = require('path');
const mongoose = require('mongoose');
const connection = require('./config/db');
const Product = require('./Models/product.model');
const NewArrival = require('./Models/newArrive.model');
const SpecialProduct = require('./Models/specialProducts.model');
const TrendingProduct = require('./Models/trendingNow.model');

const shoeData = [
    { title: "Nike Air Max 270", price: 150, category: "Lifestyle", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Nike", gender: "unisex" },
    { title: "Adidas Ultraboost 1.0", price: 180, category: "Running", img: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Adidas", gender: "unisex" },
    { title: "Puma Suede Classic", price: 70, category: "Streetwear", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Puma", gender: "unisex" },
    { title: "Reebok Club C 85", price: 85, category: "Casual", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Reebok", gender: "unisex" },
    { title: "New Balance 574", price: 90, category: "Classic", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "New Balance", gender: "unisex" },
    { title: "Vans Old Skool", price: 60, category: "Skate", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Vans", gender: "unisex" },
    { title: "Converse Chuck Taylor", price: 55, category: "Classic", img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Converse", gender: "unisex" },
    { title: "Jordan 1 Retro High", price: 170, category: "Basketball", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Jordan", gender: "unisex" },
    { title: "Asics Gel-Lyte III", price: 120, category: "Running", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Asics", gender: "unisex" },
    { title: "Brooks Ghost 14", price: 130, category: "Performance", img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Brooks", gender: "unisex" },
    { title: "Saucony Shadow 6000", price: 110, category: "Retro", img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Saucony", gender: "unisex" },
    { title: "Mizuno Wave Rider", price: 140, category: "Performance", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", brand: "Mizuno", gender: "unisex" }
];

async function seed() {
    try {
        await connection;
        console.log("Connected to MongoDB...");

        // Clear all relevant collections
        await Product.deleteMany({ gender: "unisex" }); // Only clear seeded items to avoid deleting user custom data
        await NewArrival.deleteMany({});
        await SpecialProduct.deleteMany({});
        await TrendingProduct.deleteMany({});
        console.log("Cleared existing collections.");

        // 1. Insert into main Product collection first
        const possibleTags = ["New", "Trending", "Exclusive", "Sale", "Limited Edition"];
        const mainProducts = shoeData.map(item => ({
            ...item,
            images: [item.img],
            variants: [{
                size: "10",
                width: "D",
                color: "Original",
                sku: `SKU-${Math.random().toString(36).substr(2, 9)}`,
                price: item.price,
                stock: 50
            }],
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500),
            tags: [possibleTags[Math.floor(Math.random() * possibleTags.length)]]
        }));

        const savedMainProducts = await Product.insertMany(mainProducts);
        console.log(`Seeded ${savedMainProducts.length} items into main Product collection.`);

        // Shuffle function
        const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

        // 2. Use those same objects (with IDs) for featured collections
        const featuredData = savedMainProducts.map(p => ({
            _id: p._id,
            title: p.title,
            img: p.images[0],
            price: p.variants[0].price,
            category: p.category
        }));

        await NewArrival.insertMany(shuffle(featuredData).slice(0, 8));
        await SpecialProduct.insertMany(shuffle(featuredData).slice(0, 8));
        await TrendingProduct.insertMany(shuffle(featuredData).slice(0, 8));

        console.log("Seeding completed successfully with ID parity across collections!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
