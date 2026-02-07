import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({
                success: false,
                message: 'Phone and OTP required'
            }, { status: 400 });
        }

        // Find user with matching phone and OTP
        const user = await User.findOne({
            phone,
            otp,
            otpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid or expired OTP'
            }, { status: 400 });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: 'user'
        };
        const jwtToken = await signJWT(tokenPayload);

        // Create response with user data
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                profileImage: user.profileImage
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('user_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('OTP verify error:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}
