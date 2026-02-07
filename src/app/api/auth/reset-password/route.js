import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const RECOVERY_KEY = process.env.RECOVERY_KEY || 'admin-secret-recovery-key';

export async function POST(request) {
    try {
        const { email, newPassword, recoveryKey } = await request.json();

        if (recoveryKey !== RECOVERY_KEY) {
            return NextResponse.json({ error: "Invalid Recovery Key" }, { status: 403 });
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully", success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
