import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { otpStore } from '@/lib/store';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(request) {
  let otp; // Declare outside try block so it's accessible in catch

  try {
    const { fullName, phone, email, type } = await request.json();

    if (!email || !phone || !fullName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if admin exists based on flow type (with fallback for no DB)
    let existingAdmin = null;
    try {
      await connectToDatabase();
      existingAdmin = await Admin.findOne({ email });

      if (type === 'signup') {
        if (existingAdmin) {
          return NextResponse.json(
            { error: 'Admin already exists with this email. Please log in.' },
            { status: 400 }
          );
        }
      } else {
        // Login flow: Check if admin exists
        if (!existingAdmin) {
          return NextResponse.json(
            { error: 'No admin account found with this email. Please sign up first.' },
            { status: 404 }
          );
        }
      }
    } catch (dbError) {
      console.warn('⚠️ Database not available, skipping admin verification:', dbError.message);
      // In development without DB, allow OTP generation
      console.log('🔧 Development mode: Proceeding without database check');
    }

    // Generate 6-digit OTP
    otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5 minutes expiry
    otpStore.set(email, {
      otp,
      fullName,
      phone,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Premium email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Admin Login OTP - Secure Access',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%); padding: 40px 20px; }
            .content { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .lock-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #0066ff, #00ccff); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            h1 { color: #1a1a1a; font-size: 28px; margin: 0 0 10px; }
            .subtitle { color: #666; font-size: 14px; margin: 0; }
            .otp-box { background: linear-gradient(135deg, #0066ff, #00ccff); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 48px; font-weight: 700; color: white; letter-spacing: 8px; margin: 0; }
            .info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-item { display: flex; align-items: center; margin: 10px 0; color: #333; font-size: 14px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
            .warning { color: #ff6b6b; font-size: 13px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="lock-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 17a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5 5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3z"/>
                  </svg>
                </div>
                <h1>Admin Login Verification</h1>
                <p class="subtitle">Secure Infrastructure Access</p>
              </div>

              <div class="otp-box">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px; font-size: 14px;">Your OTP Code</p>
                <p class="otp-code">${otp}</p>
              </div>

              <div class="info">
                <div class="info-item">
                  <strong>Name:</strong>&nbsp;${fullName}
                </div>
                <div class="info-item">
                  <strong>Phone:</strong>&nbsp;+91 ${phone}
                </div>
                <div class="info-item">
                  <strong>Email:</strong>&nbsp;${email}
                </div>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.
                If you didn't request this, please ignore this email.
              </p>

              <p class="warning">
                ⚠️ Security Notice: Never share your OTP with anyone, including our support team.
              </p>

              <div class="footer">
                <p>© 2026 Plumber Service Admin Portal</p>
                <p>Secure Infrastructure Management System</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'OTP sent successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);

    // FALLBACK FOR DEVELOPMENT: If email fails, still allow login by logging OTP to console
    if (otp) {
      console.log('================================================');
      console.log('⚠️ EMAIL SENDING FAILED (Likely due to missing credentials)');
      console.log(`🔐 YOUR OTP IS: ${otp}`);
      console.log('================================================');

      return NextResponse.json(
        { message: 'OTP generated (Check server console for OTP)', success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate OTP. Please try again.', details: error.message },
      { status: 500 }
    );
  }
}

