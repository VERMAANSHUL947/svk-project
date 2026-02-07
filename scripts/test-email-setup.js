require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function main() {
    console.log('Testing Email Configuration...');
    console.log(`User: ${process.env.EMAIL_USER}`);

    // Mask password for security in logs
    const pass = process.env.EMAIL_PASS || '';
    console.log(`Pass: ${pass.substring(0, 4)}...`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER or EMAIL_PASS is missing in .env.local');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from SVK Project",
            text: "If you received this, your email configuration is working correctly!",
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your execution logs or inbox.');
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        if (error.code === 'EAUTH') {
            console.error('--> Use an App Password, not your regular Gmail password.');
            console.error('--> Check for extra spaces in .env.local');
        }
    }
}

main();
