import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        // Find user
        let user = await User.findOne({ email });

        // If user doesn't exist, don't allow login
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Account not found. Please sign up first.'
            }, { status: 404 });
        }

        // Create verification token
        const token = crypto.randomBytes(32).toString('hex');
        user.verificationToken = token;
        user.verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/email/verify?token=${token}&email=${email}`;

        const mailOptions = {
            from: `"HomeServices" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Login to HomeServices',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #2563eb;">Welcome to HomeServices</h2>
                    <p>Click the button below to securely sign in to your account. This link will expire in 1 hour.</p>
                    <a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">Verify & Login</a>
                    <p style="margin-top: 20px; color: #64748b; font-size: 0.875rem;">If you did not request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Verification link sent' });

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
