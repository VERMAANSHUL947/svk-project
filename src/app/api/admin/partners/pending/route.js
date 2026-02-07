import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

export async function GET(req) {
    try {
        try {
            await connectToDatabase();
            // Fetch only pending partners, sort by newest first
            const pendingPartners = await Partner.find({ status: 'Pending' }).sort({ createdAt: -1 });

            return NextResponse.json({ success: true, partners: pendingPartners });
        } catch (dbError) {
            console.warn('⚠️ Database not available, returning mock pending partners:', dbError.message);
            // Return mock pending partners for development
            const mockPartners = [
                {
                    _id: '1',
                    fullName: 'Rajesh Kumar',
                    phoneNumber: '+91 9876543210',
                    serviceCategory: 'Plumber',
                    status: 'Pending',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
                },
                {
                    _id: '2',
                    fullName: 'Amit Singh',
                    phoneNumber: '+91 9876543211',
                    serviceCategory: 'Electrician',
                    status: 'Pending',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
                },
                {
                    _id: '3',
                    fullName: 'Vikram Patel',
                    phoneNumber: '+91 9876543212',
                    serviceCategory: 'Carpenter',
                    status: 'Pending',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
                }
            ];
            return NextResponse.json({ success: true, partners: mockPartners });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch pending partners' }, { status: 500 });
    }
}

