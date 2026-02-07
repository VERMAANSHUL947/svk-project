import mongoose from 'mongoose';

const ServiceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String, // URL from gallery or emoji/icon class
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        default: null
    },
    level: {
        type: Number,
        enum: [0, 1, 2], // 0: Parent, 1: Sub, 2: Service (Co-category)
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    details: {
        type: [String], // Bullet points for services
        default: []
    },
    image: {
        type: String, // Cover image URL (for sub-categories)
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    partnerId: {
        type: String, // If specific to a partner, otherwise 'global'
        default: 'global'
    },
    order: {
        type: Number,
        default: 0
    },
    isEssential: {
        type: Boolean,
        default: false
    },
    isMostBooked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);
