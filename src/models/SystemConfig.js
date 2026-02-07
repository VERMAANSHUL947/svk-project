import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
    serviceRadius: { type: Number, default: 25 },
    commissionPercentage: { type: Number, default: 12 },
    maintenanceMode: { type: Boolean, default: false },
    activeCoupons: { type: Number, default: 0 },
}, { timestamps: true });

// We usually only have one config document
export default mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
