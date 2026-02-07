import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        // Optional for OAuth/Magic Link users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profileImage: {
        type: String,
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    referralCodeUsed: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
}, { timestamps: true });

// Force delete model to clear cache
if (mongoose.models.User) {
    delete mongoose.models.User;
}

const User = mongoose.model('User', UserSchema);
export default User;
