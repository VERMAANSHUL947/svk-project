import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discountValue: {
        type: String, // e.g. "20%" or "₹15"
        required: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Flat'],
        default: 'Percentage'
    },
    validityStart: {
        type: Date,
        required: true
    },
    validityEnd: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Live', 'Expired', 'Draft'],
        default: 'Live'
    },
    partnerId: {
        type: String,
        default: 'global' // Or the partner's ID
    }
}, { timestamps: true });

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
