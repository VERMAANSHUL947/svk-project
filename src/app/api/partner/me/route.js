import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import { verifyJWT } from '@/lib/auth'; // Ensure you have this utility

export async function GET(req) {
    try {
        await connectToDatabase();

        // 1. Verify Token
        const token = req.cookies.get('partner_token')?.value;
        if (!token) {
            console.log('API /partner/me: No partner_token found');
            return NextResponse.json({ success: false, message: 'Unauthorized: No token' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            console.log('API /partner/me: Invalid token or role mismatch', decoded);
            return NextResponse.json({ success: false, message: 'Invalid Token or Role' }, { status: 403 });
        }

        console.log('API /partner/me: Token verified for ID:', decoded.id);

        // 2. Fetch Partner Data
        const partnerId = typeof decoded.id === 'object' && decoded.id.toString ? decoded.id.toString() : decoded.id;
        const partner = await Partner.findById(partnerId).select('-otp -otpExpiry');

        if (!partner) {
            console.log('API /partner/me: Partner not found in DB for ID:', decoded.id);
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, partner });
    } catch (error) {
        console.error('API /partner/me Error:', error);

        // Force logout if invalid token data causes crash
        const response = NextResponse.json({ success: false, message: 'Server Error: ' + error.message }, { status: 500 });
        response.cookies.delete('partner_token');
        return response;
    }
}
