import { NextResponse } from 'next/server';
import { getDB } from "@/lib/db";
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const db = await getDB();
        const orders = db.orders || [];

        // 1. Calculate General Stats
        const totalRevenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + o.total, 0);

        const pendingCount = orders.filter(o => o.status === 'pending').length;
        const processingCount = orders.filter(o => o.status === 'completed' && o.createdAt.includes(new Date().toISOString().split('T')[0])).length; // Very rough "processing" mock

        // 2. Revenue Trend (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const revenueTrend = last7Days.map(date => {
            const dayRevenue = orders
                .filter(o => o.status === 'completed' && o.createdAt.startsWith(date))
                .reduce((sum, o) => sum + o.total, 0);
            return { date, revenue: dayRevenue };
        });

        // 3. Operational Health
        const health = {
            pending: pendingCount,
            completed: orders.filter(o => o.status === 'completed').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
            total: orders.length
        };

        // 4. Recent Activity (Pulse)
        // Combine recent orders and maybe draft updates if we had a log
        const recentPulse = orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(o => ({
                t: "Order Received",
                d: `Order #${o.id.slice(-6)} placed • Rs. ${o.total.toLocaleString()}`,
                time: getTimeAgo(o.createdAt),
                c: o.status === 'completed' ? "bg-green-500" : o.status === 'pending' ? "bg-yellow-500" : "bg-red-500"
            }));

        // 5. Inventory Health (Low Stock)
        const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
        let lowStockItems = [];
        try {
            const productsContent = await fs.readFile(productsPath, 'utf-8');
            const products = JSON.parse(productsContent);
            lowStockItems = products.filter((p: any) => {
                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ?? 0;
                return totalStock > 0 && totalStock < 5; // Alert if below 5 units
            }).map((p: any) => ({ name: p.name, stock: p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) }));
        } catch (e) { }

        return NextResponse.json({
            reports: {
                revenue: {
                    total: totalRevenue,
                    average: orders.length > 0 ? (totalRevenue / orders.length) : 0,
                    trend: revenueTrend
                },
                orders: {
                    total: orders.length,
                    pending: pendingCount,
                    health: health
                }
            },
            inventory: {
                lowStock: lowStockItems.slice(0, 3)
            },
            recentPulse
        });

    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
    }
}

function getTimeAgo(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMins > 0) return `${diffInMins}m ago`;
    return "just now";
}
