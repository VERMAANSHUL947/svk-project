import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    partnerId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    placement: {
        type: String, // 'Main Home Screen', 'Category Page', etc.
        default: 'Main Home Screen'
    },
    linkToCategory: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    activeDuration: {
        type: String
    },
    price: {
        type: Number
    },
    badge: {
        type: String,
        default: 'FLASH SALE'
    },
    subtitle: {
        type: String
    },
    bgColor: {
        type: String
    },
    textColor: {
        type: String
    },
    status: {
        type: String,
        enum: ['Draft', 'Live', 'Expired'],
        default: 'Live'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
