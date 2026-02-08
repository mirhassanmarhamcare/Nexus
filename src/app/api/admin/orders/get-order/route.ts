import { NextResponse } from 'next/server';
import { getDB } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const db = await getDB();
        const order = db.orders.find(o => o.id === id);

        if (order) {
            return NextResponse.json(order);
        } else {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
    }
}
