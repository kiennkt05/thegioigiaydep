const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('--- Database Check ---');
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const { databases } = await admin.listDatabases();
        console.log('Available databases:', databases.map(db => db.name));

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in zoppos database:', collections.map(c => c.name));

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

checkDB();
