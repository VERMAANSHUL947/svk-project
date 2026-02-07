import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
    partnerId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
