import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Media from '@/models/Media';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get('partnerId');

        if (!partnerId) {
            return NextResponse.json({ success: false, message: 'Partner ID required' }, { status: 400 });
        }

        const gallery = await Media.find({ partnerId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, gallery });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { url, title, partnerId } = body;

        if (!url || !partnerId) {
            return NextResponse.json({ success: false, message: 'URL and Partner ID required' }, { status: 400 });
        }

        const newItem = await Media.create({ url, title, partnerId });
        return NextResponse.json({ success: true, item: newItem });
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
        await Media.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Media deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
