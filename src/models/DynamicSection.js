import mongoose from 'mongoose';

const DynamicSectionSchema = new mongoose.Schema({
    partnerId: {
        type: String, // 'global' or specific partner ID
        default: 'global'
    },
    title: {
        type: String,
        required: true
    },
    services: [{
        name: String,
        price: Number,
        image: String,
        description: String,
        badge: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.DynamicSection || mongoose.model('DynamicSection', DynamicSectionSchema);
