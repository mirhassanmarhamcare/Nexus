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
        const categories = await request.json();
        const categoriesPath = path.join(process.cwd(), 'src', 'data', 'categories.json');

        // Basic validation
        if (!Array.isArray(categories)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Save Categories Error:", error);
        return NextResponse.json({ error: "Failed to save categories" }, { status: 500 });
    }
}
