import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'All Status';

        const query = {};

        // Search Logic
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter Logic
        if (status === 'Verified') {
            query.isVerified = true;
        } else if (status === 'Pending') {
            query.isVerified = false;
        }

        // Stats Calculation
        const totalUsers = await User.countDocuments({});

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newJoined = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        const pendingVerification = await User.countDocuments({ isVerified: false });
        const suspendedAccounts = 0; // Placeholder as schema doesn't have status field yet

        // Pagination
        const skip = (page - 1) * limit;
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalFiltered = await User.countDocuments(query);
        const totalPages = Math.ceil(totalFiltered / limit);

        return NextResponse.json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers: totalFiltered,
                perPage: limit
            },
            stats: {
                totalUsers,
                newJoined,
                pendingVerification,
                suspendedAccounts
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
