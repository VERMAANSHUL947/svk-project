import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';

export async function GET(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
        }

        const user = await User.findOne({
            email,
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=Invalid or expired token`);
        }

        // Verify user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        // Generate JWT
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: 'user'
        };
        const jwtToken = await signJWT(tokenPayload);

        // Redirect to success page which will handle localStorage save
        const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/success`);

        // Set secure HTTP-only cookie
        response.cookies.set('user_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login?error=Something went wrong`);
    }
}
