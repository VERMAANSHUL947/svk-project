import { NextResponse } from 'next/server';

export async function POST(request) {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear user_token cookie (new)
    response.cookies.set('user_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    // Clear token cookie (old/backup)
    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
