import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    // Hardcoded password for this architecture
    // Ideally this comes from process.env.ADMIN_PASSWORD
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nexus123";

    console.log("Login attempt with password:", password);
    console.log("Comparing against:", ADMIN_PASSWORD);

    if (password === ADMIN_PASSWORD) {
        // Set a cookie
        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
