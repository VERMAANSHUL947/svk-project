import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';


export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check OTP and Expiry
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // Clear OTP after success
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate Token
        // Use the shared signJWT function to ensure compatibility with verifyJWT
        const { signJWT } = require('@/lib/auth');
        const token = await signJWT({
            id: user._id,
            email: user.email
        });

        const response = NextResponse.json({ message: "Login successful", success: true });

        // Set Cookie
        // Must use 'user_token' to match api/auth/me check
        response.cookies.set('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
