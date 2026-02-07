require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
    console.log("Testing MongoDB Connection...");
    console.log("URI:", process.env.MONGODB_URI?.substring(0, 20) + "...");

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Connection Failed!");
        console.error("Error:", error.message);
    }
}

testConnection();
