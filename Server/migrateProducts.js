const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./Models/product.model');

console.log('--- Migration Script Started ---');
console.log('Current working directory:', process.cwd());
console.log('Directory of script:', __dirname);
console.log('MONGODB_URL present:', !!process.env.MONGODB_URL);

// Existing Models
const MenProduct = require('./Models/menProducts.model');
const WomenProduct = require('./Models/womenProducts.model');
const KidsProduct = require('./Models/kidsProducts.model');
const NewArrive = require('./Models/newArrive.model');
const NewProduct = require('./Models/newProducts.model');
const SpecialProduct = require('./Models/specialProducts.model');
const TrendingNow = require('./Models/trendingNow.model');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB for migration...');

        const collections = [
            { model: MenProduct, gender: 'men', category: 'General' },
            { model: WomenProduct, gender: 'women', category: 'General' },
            { model: KidsProduct, gender: 'kids', category: 'General' },
            { model: NewArrive, gender: 'unisex', category: 'New Arrivals' },
            { model: NewProduct, gender: 'unisex', category: 'New Products' },
            { model: SpecialProduct, gender: 'unisex', category: 'Special' },
            { model: TrendingNow, gender: 'unisex', category: 'Trending' }
        ];

        for (const item of collections) {
            const data = await item.model.find();
            console.log(`Migrating ${data.length} items from ${item.model.modelName}...`);

            for (const doc of data) {
                const newProduct = new Product({
                    title: doc.title,
                    brand: 'Zappos Brand', // Default brand as it's missing in old models
                    description: `${doc.title} - High quality product from our ${item.category} collection.`,
                    category: doc.category || item.category,
                    gender: item.gender,
                    images: [doc.img],
                    variants: [{
                        size: 'Default',
                        width: 'Standard',
                        color: 'Default',
                        sku: `${doc._id}_default`,
                        price: doc.price,
                        stock: 50 // Default stock
                    }],
                    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
                    reviewCount: Math.floor(Math.random() * 100)
                });
                await newProduct.save();
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
