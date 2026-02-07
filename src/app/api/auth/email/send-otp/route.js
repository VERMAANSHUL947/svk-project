import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EmailOtp from '@/models/EmailOtp';
import { sendEmail } from '@/lib/email';
import Partner from '@/models/Partner';
import User from '@/models/User';
import otpStore from '@/lib/otpStore';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        const { email: rawEmail, type, userType } = await req.json(); // userType: 'user' or 'partner'
        const email = rawEmail?.toLowerCase().trim();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Try database operations with fallback
        try {
            await connectToDatabase();

            // Check existence based on type and userType
            if (userType === 'partner') {
                const existingPartner = await Partner.findOne({ email });
                if (type === 'register' && existingPartner) {
                    return NextResponse.json({ success: false, message: 'Email is already registered. Please login.' }, { status: 400 });
                }
                if (type === 'login' && !existingPartner) {
                    return NextResponse.json({ success: false, message: 'Email not found. Please register.' }, { status: 404 });
                }
            } else {
                // User type
                const existingUser = await User.findOne({ email });
                if (type === 'register' && existingUser && existingUser.isVerified) {
                    return NextResponse.json({ success: false, message: 'Email is already registered. Please login.' }, { status: 400 });
                }
                if (type === 'login' && !existingUser) {
                    return NextResponse.json({ success: false, message: 'Email not found. Please register.' }, { status: 404 });
                }
            }

            // Save to DB
            await EmailOtp.findOneAndUpdate(
                { email },
                { otp, expiresAt, verified: false },
                { upsert: true, new: true }
            );

            console.log(`✅ OTP saved to database for ${email}: ${otp}`);
        } catch (dbError) {
            console.warn('⚠️ Database not available, using in-memory OTP:', dbError.message);
            // Fallback: Store in memory
            otpStore.set(email, { otp, expiresAt, verified: false });
            console.log(`🔐 OTP stored in-memory for ${email}: ${otp}`);
        }

        // Send Email
        const subject = 'Your Verification Code';
        const text = `Your verification code is ${otp}. It expires in 5 minutes.`;
        const html = `<p>Your verification code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendEmail(email, subject, text, html);
                console.log(`📧 OTP email sent to ${email}`);
            } catch (emailError) {
                console.warn('⚠️ Email sending failed:', emailError.message);
                console.log(`🔐 YOUR OTP IS: ${otp}`);
            }
        } else {
            console.log(`================================================`);
            console.log(`📧 [Mock Email] To: ${email}`);
            console.log(`🔐 YOUR OTP IS: ${otp}`);
            console.log(`================================================`);
        }

        return NextResponse.json({ success: true, message: 'OTP sent to email' });

    } catch (error) {
        console.error('Send Email OTP Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Export store (deprecated, use import from @/lib/otpStore)
export { otpStore };
