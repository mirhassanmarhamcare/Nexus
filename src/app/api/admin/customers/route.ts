import { NextResponse } from 'next/server';
import { getDB } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDB();
        const orders = db.orders || [];
        const users = db.users || [];

        // Aggregate data per email (to catch guest checkouts and registered users)
        const customerMap = new Map<string, any>();

        // Process Registered Users first for baseline data
        users.forEach(u => {
            customerMap.set(u.email, {
                id: u.id,
                name: u.name || "Anonymous",
                email: u.email,
                totalSpend: 0,
                orderCount: 0,
                lastOrder: null,
                status: 'MEMBER',
                orders: []
            });
        });

        // Process Orders to calculate LTV and history
        orders.forEach(o => {
            const email = o.userId || o.shipping?.email; // Assuming guest email is in shipping
            if (!email) return;

            if (!customerMap.has(email)) {
                customerMap.set(email, {
                    id: `guest-${Math.random().toString(36).substr(2, 5)}`,
                    name: `${o.shipping?.firstName} ${o.shipping?.lastName}` || "Guest",
                    email: email,
                    totalSpend: 0,
                    orderCount: 0,
                    lastOrder: null,
                    status: 'GUEST',
                    orders: []
                });
            }

            const customer = customerMap.get(email);
            customer.totalSpend += o.total;
            customer.orderCount += 1;
            customer.orders.push({
                id: o.id,
                total: o.total,
                status: o.status,
                date: o.createdAt
            });

            if (!customer.lastOrder || new Date(o.createdAt) > new Date(customer.lastOrder)) {
                customer.lastOrder = o.createdAt;
            }
        });

        const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load customers" }, { status: 500 });
    }
}
