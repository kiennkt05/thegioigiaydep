const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkZapposDB = async () => {
    try {
        // Force connection to 'zappos' database
        const url = process.env.MONGODB_URL.replace('/zoppos', '/zappos');
        await mongoose.connect(url);
        console.log('--- Database Check (zappos) ---');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in zappos database:', collections.map(c => c.name));

        for (const coll of collections) {
            const count = await mongoose.connection.db.collection(coll.name).countDocuments();
            console.log(`- ${coll.name}: ${count} documents`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkZapposDB();
