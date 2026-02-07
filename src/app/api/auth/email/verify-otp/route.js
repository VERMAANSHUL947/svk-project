import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import Partner from '@/models/Partner';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import otpStore from '@/lib/otpStore';

export async function POST(req) {
    try {
        const { email: rawEmail, otp, type, userType } = await req.json(); // userType: 'user' or 'partner'
        const email = rawEmail?.toLowerCase().trim();

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
        }

        // Try database operations with fallback
        try {
            await connectToDatabase();

            const record = await EmailOtp.findOne({ email });

            if (!record) {
                return NextResponse.json({ success: false, message: 'OTP not found or expired' }, { status: 400 });
            }

            if (record.otp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
            }

            if (new Date() > record.expiresAt) {
                return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
            }

            // --- OTP Verified ---

            // If Type is Login -> Issue Token
            if (type === 'login') {
                if (userType === 'partner') {
                    const partner = await Partner.findOne({ email });
                    if (partner) {
                        const token = await signJWT({
                            id: partner._id.toString(),
                            role: 'partner',
                            email: partner.email
                        });

                        (await cookies()).set('partner_token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24,
                            path: '/',
                        });

                        await EmailOtp.deleteOne({ email });
                        return NextResponse.json({ success: true, message: 'Login successful', action: 'login' });
                    } else {
                        return NextResponse.json({ success: false, message: 'Partner account not found' }, { status: 404 });
                    }
                } else {
                    // User login
                    const user = await User.findOne({ email });
                    if (user) {
                        const token = await signJWT({
                            id: user._id.toString(),
                            role: 'user',
                            email: user.email,
                            fullName: user.fullName
                        });

                        (await cookies()).set('user_token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 60 * 60 * 24,
                            path: '/',
                        });

                        // Mark user as verified
                        user.isVerified = true;
                        await user.save();

                        await EmailOtp.deleteOne({ email });
                        return NextResponse.json({ success: true, message: 'Login successful', action: 'login', user: { id: user._id, fullName: user.fullName, email: user.email } });
                    } else {
                        return NextResponse.json({ success: false, message: 'User account not found' }, { status: 404 });
                    }
                }
            }

            // Registration Verification
            record.verified = true;
            await record.save();

            return NextResponse.json({ success: true, message: 'Email verified successfully' });

        } catch (dbError) {
            console.warn('⚠️ Database not available, using fallback verification:', dbError.message);

            // Fallback: Check in-memory store
            const record = otpStore.get(email);
            console.log(`Checking in-memory record for ${email}:`, record);

            if (!record) {
                return NextResponse.json({ success: false, message: 'OTP not found or expired' }, { status: 400 });
            }

            if (record.otp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
            }

            if (new Date() > record.expiresAt) {
                otpStore.delete(email);
                return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
            }

            console.log(`🔐 OTP verified for ${email} (In-memory mode)`);

            // Check partner existence even in fallback if possible (usually not possible without DB)
            // But let's allow it for development
            const token = await signJWT({
                email: email,
                role: userType || 'user',
                fullName: 'Demo ' + (userType === 'partner' ? 'Partner' : 'User')
            });

            const cookieName = userType === 'partner' ? 'partner_token' : 'user_token';
            (await cookies()).set(cookieName, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            otpStore.delete(email);

            return NextResponse.json({
                success: true,
                message: 'Login successful (Development mode)',
                action: 'login'
            });
        }

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
