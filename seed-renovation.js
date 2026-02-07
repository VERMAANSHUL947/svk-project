const mongoose = require('mongoose');

// Define Schema here since we are running as a standalone script
const ServiceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: String,
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', default: null },
    level: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    details: [String],
    image: String,
    status: { type: String, default: 'Active' },
    partnerId: { type: String, default: 'global' }
});

const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);

async function seed() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/svk-project');
        console.log('Connected to MongoDB');

        // Clear existing categories to avoid duplicates
        await ServiceCategory.deleteMany({ name: /Renovation/i });
        console.log('Cleared existing renovation categories');

        // 1. Create Parent
        const parent = await ServiceCategory.create({
            name: 'Home Renovation',
            icon: '🏠',
            level: 0,
            partnerId: 'global'
        });
        console.log('Created Parent:', parent.name);

        // 2. Create Sub-categories (Level 1)
        const subs = [
            {
                name: 'Bathroom Renovation',
                icon: '🚿',
                image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
                services: [
                    { name: 'Complete Bathroom Renovation', price: 15000, icon: '🚿' },
                    { name: 'Bathroom Tiling', price: 5000, icon: '🔲' }
                ]
            },
            {
                name: 'Painter',
                icon: '🎨',
                image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
                services: [
                    { name: 'Interior Painting', price: 8000, icon: '🎨' },
                    { name: 'Wall Texture', price: 3500, icon: '✨' }
                ]
            },
            {
                name: 'Waterproofing',
                icon: '💧',
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
                services: [
                    { name: 'Roof Waterproofing', price: 10000, icon: '🏠' }
                ]
            }
        ];

        for (const s of subs) {
            const subCat = await ServiceCategory.create({
                name: s.name,
                icon: s.icon,
                image: s.image,
                parentId: parent._id,
                level: 1,
                partnerId: 'global'
            });
            console.log('Created Sub:', subCat.name);

            // 3. Create Services (Level 2)
            for (const service of s.services) {
                await ServiceCategory.create({
                    name: service.name,
                    icon: service.icon,
                    price: service.price,
                    parentId: subCat._id,
                    level: 2,
                    partnerId: 'global'
                });
            }
        }

        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
