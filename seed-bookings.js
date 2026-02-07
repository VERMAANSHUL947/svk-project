const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const BookingSchema = new mongoose.Schema({
    userId: String,
    userDetails: {
        name: String,
        email: String,
        phone: String,
        address: Object
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
    }],
    totalAmount: Number,
    category: String,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: String,
    scheduledDate: String,
    scheduledTimeSlot: String,
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Clear existing test bookings if any
        await Booking.deleteMany({ userId: 'test_seed_user' });

        const testBookings = [
            {
                userId: 'test_seed_user',
                userDetails: {
                    name: 'Rajesh Kumar',
                    email: 'rajesh@example.com',
                    phone: '9876543210',
                    address: { street: '123 Main St', city: 'Delhi' }
                },
                items: [
                    { name: 'Kitchen Sink Leak Repair', price: 499, quantity: 1, category: 'Plumber' },
                    { name: 'Tap Installation', price: 299, quantity: 2, category: 'Plumber' }
                ],
                totalAmount: 1097,
                category: 'Plumber',
                status: 'Pending',
                paymentStatus: 'Paid',
                scheduledDate: '2026-02-07',
                scheduledTimeSlot: '10:00 AM - 12:00 PM'
            },
            {
                userId: 'test_seed_user',
                userDetails: {
                    name: 'Amit Sharma',
                    email: 'amit@example.com',
                    phone: '9988776655',
                    address: { street: '456 Park Ave', city: 'Mumbai' }
                },
                items: [
                    { name: 'AC Deep Cleaning', price: 1200, quantity: 2, category: 'AC Repair' }
                ],
                totalAmount: 2400,
                category: 'AC Repair',
                status: 'Confirmed',
                paymentStatus: 'Paid',
                scheduledDate: '2026-02-08',
                scheduledTimeSlot: '02:00 PM - 04:00 PM'
            }
        ];

        await Booking.insertMany(testBookings);
        console.log('✅ Seeded test bookings successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
