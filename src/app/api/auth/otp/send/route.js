import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { phone } = await req.json();

        if (!phone || phone.length < 10) {
            return NextResponse.json({
                success: false,
                message: 'Valid phone number required'
            }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Find or create user
        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user with phone
            user = await User.create({
                phone,
                fullName: `User ${phone.slice(-4)}`,
                email: `${phone}@temp.com`, // Temporary email
                otp,
                otpExpiry,
                isVerified: false
            });
        } else {
            // Update existing user with new OTP
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        }

        // In production, send OTP via SMS service (Twilio, etc.)
        // For now, log to console for testing
        console.log(`\n🔐 OTP for ${phone}: ${otp}\n`);

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            otp // Remove this in production!
        });

    } catch (error) {
        console.error('OTP send error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
