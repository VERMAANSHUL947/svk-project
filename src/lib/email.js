import nodemailer from 'nodemailer';

// Log email configuration (without exposing password)
console.log('📧 Email Config:', {
    user: process.env.EMAIL_USER,
    passConfigured: !!process.env.EMAIL_PASS,
    passLength: process.env.EMAIL_PASS?.length
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true, // Enable debug logs
    logger: true // Enable logger
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        console.log(`📨 Attempting to send email to: ${to}`);
        console.log(`📝 Subject: ${subject}`);

        const info = await transporter.sendMail({
            from: `"SVK Home Services" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('✅ Email sent successfully! MessageId:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed!');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        return { success: false, error: error.message };
    }
};
