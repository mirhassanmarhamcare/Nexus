import { NextResponse } from 'next/server';
import { db, Order } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, shipping, total, userId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Ideally, fetch product prices from DB here to verify total.
        // For now, we trust the client's total but re-calculate could be added.

        const newOrder: Order = {
            id: `NX-${Math.floor(Math.random() * 10000)}`,
            items,
            shipping,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: userId || 'guest'
        };

        await db.order.create(newOrder);

        return NextResponse.json({ success: true, orderId: newOrder.id });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
