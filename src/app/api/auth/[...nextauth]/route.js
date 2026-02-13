import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 * 12 * 100, // 100 years
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    await connectToDatabase();
                    // Check if user exists
                    let dbUser = await User.findOne({ email: user.email });

                    if (!dbUser) {
                        // Create user if they don't exist
                        dbUser = await User.create({
                            fullName: user.name,
                            email: user.email,
                            googleId: user.id,
                            profileImage: user.image,
                            isVerified: true, // Google accounts are verified
                            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                        });
                    } else if (!dbUser.googleId) {
                        // Link google account to existing email
                        dbUser.googleId = user.id;
                        dbUser.profileImage = user.image;
                        dbUser.isVerified = true;
                        await dbUser.save();
                    }
                    return true;
                } catch (error) {
                    console.error("SignIn Callback Error:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            try {
                await connectToDatabase();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    session.user.id = dbUser._id;
                    session.user.fullName = dbUser.fullName;
                    session.user.phone = dbUser.phone;
                    session.user.profileImage = dbUser.profileImage;
                    session.user.email = dbUser.email;
                }
                return session;
            } catch (err) {
                return session;
            }
        },
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET, handler as POST };
