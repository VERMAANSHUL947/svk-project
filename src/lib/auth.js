import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-it';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signJWT(payload, expiresIn = '36500d') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}
