import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        if (action === 'register') {
            const existingUser = await db.user.findUnique(email);
            if (existingUser) {
                return NextResponse.json({ error: 'User already exists' }, { status: 400 });
            }

            const newUser = await db.user.create({
                id: Math.random().toString(36).substr(2, 9),
                email,
                password, // In a real app, hash this!
                name: name || email.split('@')[0]
            });

            return NextResponse.json({ user: { email: newUser.email, name: newUser.name } });
        }

        if (action === 'login') {
            const user = await db.user.findUnique(email);
            if (!user || user.password !== password) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            return NextResponse.json({ user: { email: user.email, name: user.name } });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
