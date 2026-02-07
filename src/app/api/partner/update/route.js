import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';
import { verifyJWT } from '@/lib/auth';

export async function PUT(req) {
    try {
        await connectToDatabase();

        // 1. Verify Token
        const token = req.cookies.get('partner_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || decoded.role !== 'partner') {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 403 });
        }

        const partnerId = typeof decoded.id === 'object' && decoded.id.toString ? decoded.id.toString() : decoded.id;

        // 2. Get Data
        const body = await req.json();
        const { fullName, email, phoneNumber, secondaryEmail, timezone, language, profileImage } = body;

        // 3. Update Partner
        const updatedPartner = await Partner.findByIdAndUpdate(
            partnerId,
            {
                $set: {
                    fullName,
                    email,
                    phoneNumber,
                    secondaryEmail,
                    timezone,
                    language,
                    profileImage
                }
            },
            { new: true, runValidators: true }
        ).select('-otp -otpExpiry -password');

        if (!updatedPartner) {
            return NextResponse.json({ success: false, message: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, partner: updatedPartner, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('API /partner/update Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
