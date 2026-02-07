import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { partnerId, action } = await req.json();

        if (!partnerId || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
        }

        const newStatus = action === 'approve' ? 'Verified' : 'Rejected';

        const partner = await Partner.findByIdAndUpdate(
            partnerId,
            { status: newStatus },
            { new: true }
        );

        if (!partner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `Partner ${action}d successfully` });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update status' }, { status: 500 });
    }
}
