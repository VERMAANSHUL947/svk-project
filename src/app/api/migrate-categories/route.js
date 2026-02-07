import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

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

export async function GET(request) {
    try {
        await connectToDatabase();
        console.log('🔗 Connected to database');

        const bookings = await Booking.find({});
        console.log(`📊 Found ${bookings.length} bookings`);

        let updated = 0;
        const changes = [];

        for (const booking of bookings) {
            const oldCategory = booking.category;
            const newCategory = normalizeCategory(oldCategory);

            if (oldCategory !== newCategory) {
                booking.category = newCategory;
                await booking.save();
                const change = `Updated: "${oldCategory}" → "${newCategory}" (ID: ${booking._id})`;
                console.log(`✅ ${change}`);
                changes.push(change);
                updated++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migration complete! Updated ${updated} out of ${bookings.length} bookings.`,
            changes
        });
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
