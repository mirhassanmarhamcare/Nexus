import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const db = await getDB();
        const orders = db.orders || [];

        // Read drafts directly from file
        const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');
        let drafts = [];
        try {
            const draftsContent = await fs.readFile(draftsPath, 'utf-8');
            drafts = JSON.parse(draftsContent);
        } catch (e) {
            console.warn("Drafts file not found");
        }

        const activities: any[] = [];

        // Add real order activities
        orders.slice(-5).forEach((order: any) => {
            activities.push({
                id: `order-${order.id}`,
                type: 'ORDER',
                title: 'New Acquisition',
                detail: `Order #${order.id.slice(-6)} from ${order.shipping?.city || 'Unknown'}`,
                time: 'Recent',
                color: 'bg-green-500',
                timestamp: new Date(order.createdAt).getTime()
            });
        });

        // Add real draft activities
        drafts.slice(-5).forEach((draft: any) => {
            activities.push({
                id: `draft-${draft.id}`,
                type: 'DRAFT',
                title: 'Archive Modified',
                detail: `${draft.name} was updated in staging`,
                time: 'Just now',
                color: 'bg-[#D4AF37]',
                timestamp: Date.now() - (Math.random() * 1000000) // Slight offset for visual realism
            });
        });

        // Add some simulated "High-End" brand events for flavor
        activities.push({
            id: 'sim-1',
            type: 'USER',
            title: 'New Vanguard Status',
            detail: 'Client updated to Gold Tier Archive Access',
            time: '1h ago',
            color: 'bg-blue-500',
            timestamp: Date.now() - 3600000
        });

        activities.push({
            id: 'sim-2',
            type: 'SYSTEM',
            title: 'Global Sync Complete',
            detail: 'All retail directives successfully distributed',
            time: '3h ago',
            color: 'bg-zinc-500',
            timestamp: Date.now() - 10800000
        });

        // Sort by timestamp newest first
        const sortedActivities = activities.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        return NextResponse.json(sortedActivities);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load activity hub" }, { status: 500 });
    }
}
