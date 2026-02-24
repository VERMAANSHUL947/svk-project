import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    const envVars = {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    let dbStatus = 'Disconnected';
    let dbError = null;

    try {
        if (process.env.MONGODB_URI) {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGODB_URI);
                dbStatus = 'Connected Now';
            } else {
                dbStatus = 'Already Connected';
            }
        } else {
            dbStatus = 'No URI provided';
        }
    } catch (err) {
        dbStatus = 'Connection Failed';
        dbError = err.message;
    }

    return NextResponse.json({
        success: true,
        message: 'System Check',
        env: envVars,
        database: {
            status: dbStatus,
            error: dbError
        }
    });
}
