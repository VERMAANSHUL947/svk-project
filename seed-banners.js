const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    partnerId: { type: String, required: true },
    title: { type: String, required: true },
    placement: { type: String, default: 'Main Home Screen' },
    linkToCategory: String,
    imageUrl: { type: String, required: true },
    activeDuration: String,
    price: Number,
    badge: String,
    subtitle: String,
    bgColor: String,
    textColor: String,
    status: { type: String, default: 'Live' },
    createdAt: { type: Date, default: Date.now }
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

async function seed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/svk-project');
        console.log('Connected to MongoDB');

        await Banner.deleteMany({}); // Delete ALL to start fresh as requested
        console.log('Cleared all banners');

        const banners = [
            {
                partnerId: 'global',
                title: 'Premium Home Transformation',
                subtitle: 'Redefine Your Living Space',
                placement: 'Main Home Screen',
                linkToCategory: 'Home Renovation',
                imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop',
                price: 25000,
                badge: 'OFFER OF THE MONTH',
                bgColor: '#E3F2FD',
                textColor: '#1976D2',
                status: 'Live'
            },
            {
                partnerId: 'global',
                title: 'Interior Painting Special',
                subtitle: 'Fresh Colors for Your Walls',
                placement: 'Main Home Screen',
                linkToCategory: 'Painter',
                imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=600&fit=crop',
                price: 7999,
                badge: 'FLASH SALE',
                bgColor: '#FCE4EC',
                textColor: '#C2185B',
                status: 'Live'
            },
            {
                partnerId: 'global',
                title: 'Professional Cleaning',
                subtitle: 'Certified Experts at Your Service',
                placement: 'Main Home Screen',
                linkToCategory: 'Cleaning',
                imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=600&fit=crop',
                price: 1499,
                badge: 'BEST PRICE',
                bgColor: '#E8F5E9',
                textColor: '#2E7D32',
                status: 'Live'
            }
        ];

        await Banner.insertMany(banners);
        console.log('Inserted dynamic banners');

        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
