const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ServiceCategorySchema = new mongoose.Schema({}, { strict: false });
const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', ServiceCategorySchema);

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/svk-project";

async function checkCats() {
    try {
        await mongoose.connect(uri);
        console.log('Connected.');

        const categories = await ServiceCategory.find({}).sort({ level: 1 });
        console.log('--- ALL CATEGORIES ---');
        categories.forEach(c => {
            console.log(`[${c.level}] ${c.name} (ID: ${c._id}, Parent: ${c.parentId}, Status: ${c.status})`);
        });

        console.log('\n--- CHECKING HOME RENOVATION ---');
        const reno = categories.find(c => c.name && c.name.toLowerCase().includes('renovation'));
        if (reno) {
            console.log('Found Renovation Parent:', reno.name);
            const children = categories.filter(c => String(c.parentId) === String(reno._id));
            if (children.length > 0) {
                console.log('Children found:', children.map(c => `${c.name} (${c.status})`).join(', '));
            } else {
                console.log('No children linked to this parent.');
            }
        } else {
            console.log('❌ NO category found with name containing "renovation"');
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkCats();
