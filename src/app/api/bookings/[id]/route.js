import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Booking from '@/models/Booking';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({
                success: false,
                message: 'Booking not found'
            }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error('Fetch Booking Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
