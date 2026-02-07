import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Otp from '@/models/Otp';
import Partner from '@/models/Partner';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        // Check if partner exists
        const partner = await Partner.findOne({ phoneNumber });
        if (!partner) {
            return NextResponse.json({ success: false, message: 'Account not found. Please register first.' }, { status: 404 });
        }

        // Generate OTP
        const otpValue = '123456'; // Hardcoded for demo
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Upsert OTP
        await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp: otpValue, expiresAt, verified: false },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Login OTP Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
    }
}
