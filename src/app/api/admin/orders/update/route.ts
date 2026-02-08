import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from "@/lib/db";

export async function POST(request: Request) {
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();
        const updated = await db.order.update(id, { status });

        if (updated) {
            return NextResponse.json({ success: true, order: updated });
        } else {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
    } catch (error: any) {
        console.error("Update Order Error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
