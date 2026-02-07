require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function verifyEmail() {
    console.log("Testing Email Credentials...");
    console.log("User:", process.env.EMAIL_USER);
    // Don't log the full password for security

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ Success! Email & Password are working correctly.");
    } catch (error) {
        console.error("❌ Email Verification Failed!");
        console.error("Error:", error.message);

        if (error.response && error.response.includes('Username and Password not accepted')) {
            console.log("\n⚠️ TIP: Gmail usually requires an 'App Password' instead of your normal password.");
            console.log("Go to: Google Account > Security > 2-Step Verification > App Passwords.");
        }
    }
}

verifyEmail();
