
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

import Partner from './src/models/Partner.js';

const resetPartners = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is undefined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const res = await Partner.updateMany({}, { status: 'Pending' });
        console.log(`Reset ${res.modifiedCount} partners to Pending status.`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

resetPartners();
