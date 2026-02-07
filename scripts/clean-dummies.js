const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ServiceCategorySchema = new mongoose.Schema({}, { strict: false });
const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/svk-project";

async function cleanDummies() {
    try {
        await mongoose.connect(uri);
        console.log('Connected.');

        // Delete the dummies we added (Level 2, no parent, specific names)
        const dummyNames = ['AC Service', 'Bathroom Cleaning', 'Electrician Visit', 'Plumber Visit', 'Sofa Cleaning', 'Kitchen Cleaning'];
        const res = await ServiceCategory.deleteMany({
            name: { $in: dummyNames },
            parentId: { $exists: false }, // Only delete if they are our orphans
            level: 2
        });

        console.log(`Deleted ${res.deletedCount} dummy services.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

cleanDummies();
