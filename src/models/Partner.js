import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
    // Step 1: Basic Information
    fullName: {
        type: String,
        required: [true, 'Please provide full legal name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide business email'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number'],
        unique: true,
    },
    experience: {
        type: String,
        enum: ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'],
        default: 'Less than 1 year',
    },
    serviceCategory: {
        type: String,
        required: [true, 'Please select a service category'],
    },

    // Step 2: Verification Documents (storing URLs/paths)
    idCardFront: String,
    idCardBack: String,
    professionalLicense: String, // Optional

    // Step 3: Bank Details
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,

    // Profile Enhancements
    profileImage: String,
    secondaryEmail: String,
    timezone: { type: String, default: 'UTC-05:00 (Eastern Time)' },
    language: { type: String, default: 'English (US)' },

    // Status & Auth
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'Suspended', 'Active'], // Added Active as seen in dashboard
        default: 'Pending',
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpExpiry: Date,

}, { timestamps: true });

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
