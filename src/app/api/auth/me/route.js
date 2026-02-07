import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        console.log('🔍 /api/auth/me: Starting...');

        const token = request.cookies.get('user_token')?.value;
        console.log('🔑 Token found:', !!token);
        if (!token) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        console.log('🔓 Token decoded:', !!decoded, decoded?.id);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        // Try to connect to database and fetch user
        try {
            await connectToDatabase();
            console.log('✅ Database connected');

            const user = await User.findById(decoded.id).select('-password');
            console.log('👤 User found:', !!user, user?.email);
            if (!user) {
                return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImage: user.profileImage,
                    phone: user.phone
                }
            });
        } catch (dbError) {
            console.warn('⚠️ Database not available, using token data:', dbError.message);
            // Fallback: Return user data from token
            return NextResponse.json({
                success: true,
                user: {
                    id: decoded.id,
                    fullName: decoded.fullName || 'User',
                    email: decoded.email || '',
                    profileImage: decoded.profileImage || null,
                    phone: decoded.phone || ''
                }
            });
        }

    } catch (error) {
        console.error('❌ /api/auth/me Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 });
    }
}

