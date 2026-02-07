import { NextResponse } from 'next/server';
// Force rebuild
import { getToken } from 'next-auth/jwt';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';
import Partner from '@/models/Partner';

export async function POST(request) {
    try {
        await connectToDatabase();
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // If strict on auth:
        // if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { items, totalAmount, userDetails, scheduledDate, scheduledTimeSlot } = body;

        // Determine Category and normalize it
        // Logic: Take the category of the first item, or a default.
        // We assume items mainly belong to one category for a single booking flow.
        const rawCategory = items[0]?.category || 'General';

        // Normalize category to match partner serviceCategory format
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

        const category = normalizeCategory(rawCategory);

        console.log('📦 Booking Category:', { rawCategory, normalized: category });

        const newBooking = await Booking.create({
            userId: token?.sub || 'guest_user_id',
            userDetails: {
                name: userDetails.name || token?.name || 'Guest User',
                email: userDetails.email || token?.email || 'guest@example.com',
                phone: userDetails.phone || 'N/A',
                address: userDetails.address || {} // Store as sub-object as per model
            },
            items,
            totalAmount,
            category,
            status: 'Pending',
            paymentStatus: 'Paid', // Simulating successful payment
            scheduledDate,
            scheduledTimeSlot
        });

        return NextResponse.json({ success: true, bookingId: newBooking._id });

    } catch (error) {
        console.error('Booking Creation Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role'); // 'admin', 'partner'
        const partnerCategory = searchParams.get('category'); // e.g. 'Plumber'

        let filter = {};

        if (role === 'partner') {
            // User requested: "koi bhee kree kis bhee regarding sb patner ko show hoo"
            // So we remove the category requirement and filtering.

            if (partnerCategory && partnerCategory !== 'All') {
                // If a category IS provided, we still allow filtering, 
                // but we don't return 400 if it's missing.
                const normalizedCategory = partnerCategory.toLowerCase().trim();
                filter.category = { $regex: new RegExp(`^${partnerCategory}$`, 'i') };
            }
            // If no category or category is 'All', filter remains empty => returns everything.

            console.log('🔍 Partner Booking Fetch:', { partnerCategory, filter });
        } else if (role === 'user') {
            // User fetching their own bookings
            const email = searchParams.get('email');
            const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

            if (token?.sub) {
                filter.userId = token.sub;
            } else if (email) {
                // Fallback for hybrid/guest users matching by email
                filter['userDetails.email'] = email;
            } else {
                return NextResponse.json({ success: false, message: 'User identifier required' }, { status: 400 });
            }
        }
        // If 'admin', filter remains empty (fetch all)

        const bookings = await Booking.find(filter).sort({ createdAt: -1 });

        console.log('📊 Bookings found:', bookings.length);

        return NextResponse.json({ success: true, bookings });

    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { bookingId, status, partnerId, partnerName } = body;

        if (!bookingId || !status) {
            return NextResponse.json({ success: false, message: 'Missing bookingId or status' }, { status: 400 });
        }

        const updateData = { status };
        if (partnerId) updateData.partnerId = partnerId;
        if (partnerName) updateData.partnerName = partnerName;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true }
        );

        if (!updatedBooking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        console.log('✅ Booking Updated:', { bookingId, newStatus: status });
        return NextResponse.json({ success: true, booking: updatedBooking });

    } catch (error) {
        console.error('Update Booking Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
