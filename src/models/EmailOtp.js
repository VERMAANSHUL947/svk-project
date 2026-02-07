import mongoose from 'mongoose';

const EmailOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 300, // 5 mins
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.models.EmailOtp || mongoose.model('EmailOtp', EmailOtpSchema);
