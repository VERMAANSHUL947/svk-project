import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get('partnerId');

        const filter = { status: 'Live' };
        if (partnerId) filter.partnerId = partnerId;

        const banners = await Banner.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, banners });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        console.log('📥 RECEIVED BANNER DATA:', body);
        const { title, placement, linkToCategory, imageUrl, activeDuration, partnerId, price, badge, subtitle, bgColor, textColor } = body;

        const newBanner = await Banner.create({
            title,
            placement,
            linkToCategory,
            imageUrl,
            activeDuration,
            partnerId,
            price: price ? Number(price) : 0,
            badge,
            subtitle,
            bgColor,
            textColor,
            status: 'Live'
        });
        console.log('✅ CREATED DB BANNER:', newBanner);

        return NextResponse.json({ success: true, banner: newBanner });
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
            return NextResponse.json({ success: false, message: 'Banner ID required' }, { status: 400 });
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, banner: updatedBanner });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        await Banner.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
