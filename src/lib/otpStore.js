// Shared in-memory OTP store for development/fallback
// In a production environment with multiple instances, use Redis or MongoDB

if (!global._otpStore) {
    global._otpStore = new Map();
}

const otpStore = global._otpStore;

export default otpStore;
