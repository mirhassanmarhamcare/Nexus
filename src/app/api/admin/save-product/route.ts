import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/data/products';

export async function POST(request: Request) {
    // 1. Check Authentication
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const updatedProduct: Product = await request.json();
        const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');

        // 2. Read existing drafts
        let drafts: Product[] = [];
        try {
            const data = await fs.readFile(draftsPath, 'utf-8');
            drafts = JSON.parse(data);
        } catch (error) {
            drafts = [];
        }

        // 3. Update or Add the specific product
        const index = drafts.findIndex(p => p.id === updatedProduct.id);

        // Ensure status is draft
        updatedProduct.status = 'draft';
        updatedProduct.updatedAt = new Date().toISOString();

        if (index === -1) {
            // New product (shouldn't happen usually if create-product was called, but good for safety)
            drafts.push(updatedProduct);
        } else {
            // Update existing
            drafts[index] = updatedProduct;
        }

        // 4. Save back to file
        await fs.writeFile(draftsPath, JSON.stringify(drafts, null, 2));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Save Product Error:", error);
        return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
    }
}
