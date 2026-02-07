import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ success: false, message: 'ID and status are required' }, { status: 400 });
        }

        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        return NextResponse.json({ success: true, partner: updatedPartner });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
