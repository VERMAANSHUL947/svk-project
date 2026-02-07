import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ServiceCategory from '@/models/ServiceCategory';

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parentId');
        const isEssential = searchParams.get('isEssential');
        const isMostBooked = searchParams.get('isMostBooked');
        const level = searchParams.get('level');
        const all = searchParams.get('all');

        let query = {};
        if (parentId) query.parentId = parentId === 'null' ? null : parentId;
        if (level) query.level = Number(level);
        if (isEssential === 'true') query.isEssential = true;
        if (isMostBooked === 'true') query.isMostBooked = true;

        // Always return global categories. 
        // In future, could filter by partnerId if each partner has custom ones.
        query.partnerId = 'global';

        const categories = await ServiceCategory.find(query).sort({ order: 1, createdAt: 1 });

        if (all === 'true') {
            // Build a tree structure if requested
            const buildTree = (items, pId = null) => {
                return items
                    .filter(item => {
                        const itemPid = item.parentId ? String(item.parentId) : 'null';
                        const searchPid = pId ? String(pId) : 'null';
                        return itemPid === searchPid;
                    })
                    .map(item => ({
                        ...item._doc,
                        children: buildTree(items, item._id)
                    }));
            };
            const allCats = await ServiceCategory.find({ partnerId: 'global' }).sort({ order: 1 });
            const tree = buildTree(allCats, null);
            return NextResponse.json({ success: true, categories: tree });
        }

        return NextResponse.json({ success: true, categories });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { name, icon, image, parentId, level, price, details, partnerId, isEssential, isMostBooked } = body;

        const newCategory = await ServiceCategory.create({
            name,
            icon,
            image,
            parentId: parentId || null,
            level: level || 0,
            price: price || 0,
            details: details || [],
            partnerId: partnerId || 'global',
            isEssential: isEssential || false,
            isMostBooked: isMostBooked || false
        });

        return NextResponse.json({ success: true, category: newCategory });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

        const updated = await ServiceCategory.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json({ success: true, category: updated });
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

        // Also delete children (optional, but requested by user's screenshot UI)
        await ServiceCategory.deleteMany({ $or: [{ _id: id }, { parentId: id }] });

        return NextResponse.json({ success: true, message: 'Category and its sub-categories deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
