import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';
// import Partner from '@/models/Partner';
// import User from '@/models/User';
// import Booking from '@/models/Booking';

export async function POST(req) {
    try {
        await connectToDatabase();

        // CAUTION: This wipes data. 
        // For compliance with the request "Reset System Data", we might just reset config or delete bookings.
        // Let's reset Config to defaults and maybe clear some logs if we had them.

        await SystemConfig.deleteMany({});
        await SystemConfig.create({
            serviceRadius: 25,
            commissionPercentage: 12,
            maintenanceMode: false
        });

        // Uncomment to actually wipe everything (DANGER)
        // await Partner.deleteMany({});
        // await User.deleteMany({});
        // await Booking.deleteMany({});

        return NextResponse.json({ success: true, message: 'System configuration reset to defaults.' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
