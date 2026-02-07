// Global in-memory store for OTPs
// Using globalThis to ensure it persists across hot-reloads in development
if (!globalThis.otpStore) {
    globalThis.otpStore = new Map();
}

export const otpStore = globalThis.otpStore;
