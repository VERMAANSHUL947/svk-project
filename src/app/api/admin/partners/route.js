import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

export async function GET(req) {
    try {
        await connectToDatabase();

        // Fetch all partners, sorted by newest first
        const partners = await Partner.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: partners });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch partners' }, { status: 500 });
    }
}
