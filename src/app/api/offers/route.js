import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Offer from '@/models/Offer';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get('partnerId') || 'global';
        const offers = await Offer.find({ partnerId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, offers });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { title, discountValue, discountType, validityStart, validityEnd, partnerId, status } = body;

        const newOffer = await Offer.create({
            title,
            discountValue,
            discountType,
            validityStart,
            validityEnd,
            partnerId: partnerId || 'global',
            status: status || 'Live'
        });

        return NextResponse.json({ success: true, offer: newOffer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Offer ID required' }, { status: 400 });
        }

        const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, offer: updatedOffer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
        await Offer.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Offer deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
