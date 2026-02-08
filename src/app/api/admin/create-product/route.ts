import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    // 1. Check Authentication
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');

        // Read existing drafts
        let drafts = [];
        try {
            const data = await fs.readFile(draftsPath, 'utf-8');
            drafts = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, start with empty array
            drafts = [];
        }

        // Generate new ID
        const newId = `prod_${Date.now()}`;

        // Create empty product template
        const newProduct = {
            id: newId,
            name: "New Product",
            price: 0,
            category: "Uncategorized",
            description: "",
            images: [],
            variants: [],
            status: "draft",
            updatedAt: new Date().toISOString()
        };

        // Add to drafts
        drafts.unshift(newProduct);

        // Save back to file
        await fs.writeFile(draftsPath, JSON.stringify(drafts, null, 2));

        return NextResponse.json({ success: true, id: newId });

    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
