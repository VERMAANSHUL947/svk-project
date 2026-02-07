const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ServiceCategorySchema = new mongoose.Schema({
    name: String,
    isEssential: { type: Boolean, default: false },
    isMostBooked: { type: Boolean, default: false },
    level: Number
}, { strict: false });

const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/svk-project";

async function seedFeatured() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Reset all first
        await ServiceCategory.updateMany({}, { isEssential: false, isMostBooked: false });
        console.log('Reset flags');

        // Get some level 2 services (actual services)
        const services = await ServiceCategory.find({ level: 2 }).limit(10);

        if (services.length === 0) {
            console.log('No services found. Creating dummy data...');
            // Create dummy services if none exist
            const dummies = [
                { name: 'AC Service', price: 599, level: 2, isEssential: true, isMostBooked: true },
                { name: 'Bathroom Cleaning', price: 499, level: 2, isEssential: false, isMostBooked: true },
                { name: 'Electrician Visit', price: 199, level: 2, isEssential: true, isMostBooked: false },
                { name: 'Plumber Visit', price: 199, level: 2, isEssential: true, isMostBooked: false },
                { name: 'Sofa Cleaning', price: 799, level: 2, isEssential: false, isMostBooked: true },
                { name: 'Kitchen Cleaning', price: 999, level: 2, isEssential: true, isMostBooked: true }
            ];
            await ServiceCategory.insertMany(dummies);
            console.log('Dummy services created.');
        } else {
            console.log(`Found ${services.length} services. Updating flags...`);

            // Mark first 4 as essential
            for (let i = 0; i < Math.min(4, services.length); i++) {
                services[i].isEssential = true;
                await services[i].save();
                console.log(`Marked ${services[i].name} as Essential`);
            }

            // Mark next 4 (or random) as most booked
            for (let i = 0; i < services.length; i++) {
                if (i % 2 === 0) { // mark every alternate as most booked
                    services[i].isMostBooked = true;
                    await services[i].save();
                    console.log(`Marked ${services[i].name} as Most Booked`);
                }
            }
        }

        console.log('Done!');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedFeatured();
