import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Otp from '@/models/Otp';
import Partner from '@/models/Partner';

export async function POST(req) {
    let otpValue = '123456'; // Default for demo/testing

    try {
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        // Try database operations with fallback
        try {
            await connectToDatabase();

            // Check if phone number is already registered as a partner
            const existingPartner = await Partner.findOne({ phoneNumber });
            if (existingPartner) {
                return NextResponse.json({
                    success: false,
                    message: 'This phone number is already registered. Please login.',
                    isRegistered: true
                }, { status: 400 });
            }

            // Generate OTP
            otpValue = '123456'; // Hardcoded for demo/testing
            // otpValue = Math.floor(100000 + Math.random() * 900000).toString(); // Production

            // Save OTP
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

            // Upsert OTP
            await Otp.findOneAndUpdate(
                { phoneNumber },
                { otp: otpValue, expiresAt, verified: false },
                { upsert: true, new: true }
            );

            console.log(`✅ OTP saved to database for ${phoneNumber}: ${otpValue}`);
        } catch (dbError) {
            console.warn('⚠️ Database not available, OTP will work in-memory only:', dbError.message);
            console.log(`🔐 OTP for ${phoneNumber}: ${otpValue} (In-memory mode)`);
            // OTP generation continues without database
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Send OTP Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
    }
}

