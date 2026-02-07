import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Simple health check
        const token = request.cookies.get('user_token')?.value;

        return NextResponse.json({
            success: true,
            hasToken: !!token,
            tokenLength: token?.length || 0,
            env: {
                hasJwtSecret: !!process.env.JWT_SECRET,
                hasMongoUri: !!process.env.MONGODB_URI,
                baseUrl: process.env.NEXT_PUBLIC_BASE_URL
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
