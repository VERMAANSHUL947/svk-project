import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import DynamicSection from '@/models/DynamicSection';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get('partnerId');

        // If partnerId provided, get theirs. If not, get all active (for public view)
        const query = partnerId ? { partnerId } : { isActive: true };

        const sections = await DynamicSection.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, sections });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const newSection = await DynamicSection.create(body);
        return NextResponse.json({ success: true, section: newSection });
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
            return NextResponse.json({ success: false, message: 'Section ID required' }, { status: 400 });
        }

        const updatedSection = await DynamicSection.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, section: updatedSection });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await DynamicSection.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
