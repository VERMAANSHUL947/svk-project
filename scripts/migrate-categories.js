// Migration script to normalize existing booking categories
// Run this once to fix existing data

import connectToDatabase from '../lib/db.js';
import Booking from '../models/Booking.js';

const normalizeCategory = (cat) => {
    const lower = cat.toLowerCase().trim();

    // Map service names to partner categories
    if (lower.includes('plumb')) return 'Plumber';
    if (lower.includes('electric')) return 'Electrician';
    if (lower.includes('ac') || lower.includes('air conditioning') || lower.includes('hvac')) return 'AC Repair';
    if (lower.includes('carpen')) return 'Carpenter';
    if (lower.includes('paint')) return 'Painter';
    if (lower.includes('clean')) return 'Cleaner';
    if (lower.includes('appliance') || lower.includes('washing') || lower.includes('refrigerator')) return 'Appliance Repair';

    // Default: return as-is
    return cat;
};

async function migrateBookingCategories() {
    try {
        await connectToDatabase();
        console.log('🔗 Connected to database');

        const bookings = await Booking.find({});
        console.log(`📊 Found ${bookings.length} bookings`);

        let updated = 0;
        for (const booking of bookings) {
            const oldCategory = booking.category;
            const newCategory = normalizeCategory(oldCategory);

            if (oldCategory !== newCategory) {
                booking.category = newCategory;
                await booking.save();
                console.log(`✅ Updated: "${oldCategory}" → "${newCategory}" (ID: ${booking._id})`);
                updated++;
            }
        }

        console.log(`\n🎉 Migration complete! Updated ${updated} bookings.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateBookingCategories();
