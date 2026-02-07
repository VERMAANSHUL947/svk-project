import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import User from '@/models/User';

export async function GET(req) {
    try {
        try {
            await connectToDatabase();

            const [totalPartners, verifiedPartners, totalUsers] = await Promise.all([
                Partner.countDocuments({}),
                Partner.countDocuments({ status: 'Verified' }),
                User.countDocuments({})
            ]);

            return NextResponse.json({
                success: true,
                stats: {
                    totalPartners,
                    verifiedPartners,
                    totalUsers,
                    revenue: 125000, // Mock for now
                    bookings: 156 // Mock for now
                }
            });
        } catch (dbError) {
            console.warn('⚠️ Database not available, returning mock stats:', dbError.message);
            // Return mock data for development
            return NextResponse.json({
                success: true,
                stats: {
                    totalPartners: 12,
                    verifiedPartners: 8,
                    totalUsers: 45,
                    revenue: 125000,
                    bookings: 156
                }
            });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
    }
}

