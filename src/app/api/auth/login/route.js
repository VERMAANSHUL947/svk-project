import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        await connectToDatabase();

        // 1. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // 3. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // 4. Save OTP to DB
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // 5. Send OTP via Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Admin Login OTP',
            text: `Your OTP for admin login is: ${otp}. It expires in 10 minutes.`,
        });

        // Valid credentials, proceed to OTP step
        return NextResponse.json({ message: "OTP sent to email", success: true, requireOtp: true });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Login failed via server" }, { status: 500 });
    }
}
