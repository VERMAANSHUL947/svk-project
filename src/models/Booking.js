import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed from ObjectId to String to allow 'guest_user_id'
        required: true
    },
    userDetails: {
        name: String,
        email: String,
        phone: String,
        address: Object // Stores full address object
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String // To track category per item if needed
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true // "Plumber", "Electrician" - Main category for partner matching
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    scheduledDate: String,
    scheduledTimeSlot: String,
    partnerId: {
        type: String, // ID of the partner who confirmed
        default: null
    },
    partnerName: {
        type: String, // Name of the partner for display
        default: null
    }
}, { timestamps: true });

// Prevent Mongoose OverwriteModelError but ensure we use the NEW schema
// If we are in dev mode and need to hot-reload schema changes:
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Booking;
}

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
