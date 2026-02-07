import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Partner from '@/models/Partner';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { phoneNumber } = await req.json();

        if (!phoneNumber) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        // Check if partner exists
        let partner = await Partner.findOne({ phoneNumber });

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (partner) {
            // Update existing partner's OTP
            partner.otp = otp;
            partner.otpExpiry = otpExpiry;
            await partner.save();
        } else {
            // Create new partner placeholder
            // Note: Validation on other fields might fail if we try to save a partial partner.
            // We should make other fields optional in the model or create a partial record.
            // My model has `required` fields. This is an issue.
            // I'll need to update the model to allow partial creation OR handle this differently.
            // Alternatively, I'll use `findOneAndUpdate` with `upsert` and `{ runValidators: false }` for this step?
            // Or better, just store OTP in a separate collection `PhoneVerification`?
            // Or make fields required only if not `isDraft`.

            // Let's relax the connection validation for the initial step?
            // Actually, the best way in a flow like this is separate OTP collection or relax the model.
            // Let's relax the model requirements or provide dummy data for required fields? No that's messy.

            // I will update the Partner model to make fields optional, 
            // OR I will store OTP in a temporary way.
            // But wait, the user wants "admin like backend save". Partner should be saved.

            // I'll update the Partner model to remove `required` from fields that aren't available yet
            // OR I will provide defaults.
            // Let's try to update the model.
        }

        // Actually, let's use a "Draft" status or similar.
        // For now, I'll just upsert and bypass validation for the OTP step if possible?
        // No, Mongoose validates on save.

        // Let's CREATE a separate OTP collection effectively.
        // Or better: Use the `upsert` on a partner but we need to handle the required fields.

        // Let's Re-write the Partner Model to make fields optional but enforce them in the API validation for the final submit.
        // That is the standard pattern for multi-step forms.
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
