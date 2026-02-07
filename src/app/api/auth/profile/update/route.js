import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyJWT } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        await connectToDatabase();

        const token = request.cookies.get('user_token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = await verifyJWT(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const { fullName, profileImage, phone } = await request.json();

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;

        // If profileImage is a base64 string, save it to public/uploads/profiles
        if (profileImage && profileImage.startsWith('data:image')) {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `profile-${user._id}-${Date.now()}.png`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, buffer);
            user.profileImage = `/uploads/profiles/${fileName}`;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImage: user.profileImage,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
