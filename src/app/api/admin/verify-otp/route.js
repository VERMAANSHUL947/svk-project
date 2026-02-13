import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/store';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import { signJWT } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return NextResponse.json(
                { error: 'OTP not found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check expiry
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please check and try again.' },
                { status: 400 }
            );
        }

        // Success - delete OTP
        otpStore.delete(email);

        // PERSISTENCE: Save/Update Admin in Database (with fallback)
        let admin = null;
        let token = null;

        try {
            await connectToDatabase();
            admin = await Admin.findOne({ email });

            if (!admin) {
                // Create new admin if not exists (Signup flow)
                admin = await Admin.create({
                    email,
                    fullName: storedData.fullName || 'Admin User',
                    phone: storedData.phone || '',
                    twoFactorEnabled: true
                });
            } else {
                // Update existing if needed (Login flow might carry fresh data from OTP prompt if we want)
                if (storedData.fullName) admin.fullName = storedData.fullName;
                if (storedData.phone) admin.phone = storedData.phone;
                await admin.save();
            }

            token = await signJWT({
                id: admin._id,
                email: admin.email,
                role: 'admin',
                fullName: admin.fullName,
                phone: admin.phone
            });
        } catch (dbError) {
            console.warn('⚠️ Database not available, creating token without persistence:', dbError.message);
            // Fallback: Create token without database
            token = await signJWT({
                email: email,
                role: 'admin',
                fullName: storedData.fullName || 'Admin User',
                phone: storedData.phone || ''
            });

            // Use data from OTP store
            admin = {
                email: email,
                fullName: storedData.fullName || 'Admin User',
                phone: storedData.phone || '',
                profileImage: null
            };
        }

        const response = NextResponse.json(
            {
                message: 'OTP verified successfully',
                success: true,
                user: {
                    fullName: admin.fullName,
                    email: admin.email,
                    phone: admin.phone,
                    profileImage: admin.profileImage || null
                }
            },
            { status: 200 }
        );

        // Set Secure Cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 365 * 100 // 100 years
        });

        return response;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}
