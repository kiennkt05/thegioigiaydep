const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./Models/product.model');

dotenv.config({ path: path.join(__dirname, '.env') });

const SHOES_DIM_PATH = path.join(__dirname, '..', 'data', 'shoes_dim.csv');
const SHOES_FACT_PATH = path.join(__dirname, '..', 'data', 'shoes_fact.csv');

async function importData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB.');

        // Pass 1: Load Dimensions into memory Map
        console.log('Loading product dimensions (shoes_dim.csv)...');
        const productMap = new Map();

        await new Promise((resolve, reject) => {
            fs.createReadStream(SHOES_DIM_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    // id,name,best_for_wear,gender,image_url,dominant_color,sub_color1,sub_color2
                    const genderMap = {
                        'U': 'unisex',
                        'W': 'women',
                        'M': 'men',
                        'K': 'kids'
                    };

                    productMap.set(row.id, {
                        title: row.name,
                        brand: 'Adidas', // Based on the image URLs and names like "Breaknet", "Ultraboost"
                        description: `Best for: ${row.best_for_wear}. Colors: ${row.dominant_color}, ${row.sub_color1}, ${row.sub_color2}`,
                        category: 'Shoes',
                        gender: genderMap[row.gender] || 'unisex',
                        images: [row.image_url],
                        variants: [],
                        tags: [row.best_for_wear, row.dominant_color].filter(Boolean)
                    });
                })
                .on('end', () => {
                    console.log(`Loaded ${productMap.size} products from dimensions.`);
                    resolve();
                })
                .on('error', reject);
        });

        // Pass 2: Stream Fact table and aggregate variants
        console.log('Streaming variants (shoes_fact.csv)...');

        let processedRows = 0;

        await new Promise((resolve, reject) => {
            fs.createReadStream(SHOES_FACT_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    const productId = row.id;
                    const productData = productMap.get(productId);

                    if (productData) {
                        // Find existing size variant or create new one
                        let variant = productData.variants.find(v => v.size === row.size);

                        if (!variant) {
                            variant = {
                                size: row.size,
                                price: parseFloat(row.price),
                                stock: 0,
                                color: productData.tags[1] || 'Default',
                                sku: `${productId}-${row.size}`
                            };
                            productData.variants.push(variant);
                        }

                        // Add availability from this row
                        const stock = parseInt(row.availability, 10);
                        if (!isNaN(stock)) {
                            variant.stock += stock;
                        }
                    }

                    processedRows++;
                    if (processedRows % 10000 === 0) {
                        console.log(`Processed ${processedRows} variants...`);
                    }
                })
                .on('end', async () => {
                    console.log('Finished reading variants. Sorting variants for all products...');

                    // Helper to parse size like "39 1/3" or "40"
                    const parseSize = (sizeStr) => {
                        if (!sizeStr) return 0;
                        const parts = sizeStr.split(' ');
                        let base = parseFloat(parts[0]) || 0;
                        if (parts[1]) {
                            if (parts[1] === '1/3') base += 0.33;
                            else if (parts[1] === '2/3') base += 0.66;
                            else if (parts[1] === '1/2') base += 0.5;
                        }
                        return base;
                    };

                    for (const product of productMap.values()) {
                        product.variants.sort((a, b) => parseSize(a.size) - parseSize(b.size));
                    }
                    console.log('Preparing for database insertion...');
                    resolve();
                })
                .on('error', reject);
        });

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Database cleared.');

        const allProducts = Array.from(productMap.values()).filter(p => p.variants.length > 0);
        console.log(`Inserting ${allProducts.length} products with variants...`);

        // Insert in batches
        for (let i = 0; i < allProducts.length; i += 500) {
            const batch = allProducts.slice(i, i + 500);
            await Product.insertMany(batch);
            console.log(`Inserted ${i + batch.length} / ${allProducts.length} products...`);
        }

        console.log('Import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

importData();
