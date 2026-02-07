import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    phoneNumber: {
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
        expires: 300, // MongoDB TTL index: doc automatically removed after 300s (5 mins)
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
