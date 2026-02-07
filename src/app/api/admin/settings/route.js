import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SystemConfig from '@/models/SystemConfig';
import Admin from '@/models/Admin';
import { verifyJWT } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Helper to get or create config
async function getSystemConfig() {
    let config = await SystemConfig.findOne();
    if (!config) {
        config = await SystemConfig.create({
            serviceRadius: 25,
            commissionPercentage: 12,
            maintenanceMode: false
        });
    }
    return config;
}

export async function GET(req) {
    try {
        await connectToDatabase();

        // 1. Fetch System Settings
        const config = await getSystemConfig();

        // 2. Fetch Current Admin Profile
        let adminProfile = {
            fullName: '',
            email: '',
            phone: '',
            twoFactorEnabled: true,
            profileImage: ''
        };

        const adminToken = req.cookies.get('admin_token')?.value;
        let adminEmail = null;

        if (adminToken) {
            const payload = await verifyJWT(adminToken);
            if (payload && payload.email) {
                adminEmail = payload.email;
            }
        }

        const admin = adminEmail ? await Admin.findOne({ email: adminEmail }) : await Admin.findOne();

        if (admin) {
            adminProfile = {
                fullName: admin.fullName,
                email: admin.email,
                phone: admin.phone,
                twoFactorEnabled: admin.twoFactorEnabled,
                profileImage: admin.profileImage
            };
        }

        return NextResponse.json({
            success: true,
            settings: {
                serviceRadius: config.serviceRadius,
                commission: config.commissionPercentage,
                maintenanceMode: config.maintenanceMode,
                ...adminProfile
            }
        });

    } catch (error) {
        console.error('API Settings Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Update Config
        let config = await SystemConfig.findOne();
        if (!config) config = new SystemConfig();

        if (body.serviceRadius !== undefined) config.serviceRadius = body.serviceRadius;
        if (body.commission !== undefined) config.commissionPercentage = body.commission;
        if (body.maintenanceMode !== undefined) config.maintenanceMode = body.maintenanceMode;

        await config.save();

        // Handle Image Upload to Filesystem
        let profileImagePath = body.profileImage;
        if (body.profileImage && body.profileImage.startsWith('data:image')) {
            try {
                const base64Parts = body.profileImage.split(',');
                const base64Data = base64Parts[1];
                const mimeType = base64Parts[0].split(':')[1].split(';')[0];
                const extension = mimeType.split('/')[1];
                const fileName = `admin-profile-${Date.now()}.${extension}`;

                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile');

                // Create directory if not exists
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, base64Data, 'base64');
                profileImagePath = `/uploads/profile/${fileName}`;
            } catch (err) {
                console.error('File save error:', err);
                // Fallback to staying with old path or base64 if it fails
            }
        }

        // Update Admin Profile
        let admin = await Admin.findOne({ email: body.adminEmail });
        if (!admin) {
            admin = await Admin.findOne();
        }

        if (admin) {
            if (body.adminName) admin.fullName = body.adminName;
            if (body.adminPhone) admin.phone = body.adminPhone;
            if (body.adminEmail) admin.email = body.adminEmail;
            if (body.twoFactor !== undefined) admin.twoFactorEnabled = body.twoFactor;
            if (profileImagePath) admin.profileImage = profileImagePath;

            await admin.save();
        } else if (body.adminEmail) {
            await Admin.create({
                email: body.adminEmail,
                fullName: body.adminName || 'Admin',
                phone: body.adminPhone || '',
                twoFactorEnabled: body.twoFactor !== undefined ? body.twoFactor : true,
                profileImage: profileImagePath || ''
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
            profileImage: profileImagePath
        });

    } catch (error) {
        console.error('API Settings Save Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
