
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await request.json();
        const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');

        let drafts = [];
        try {
            const data = await fs.readFile(draftsPath, 'utf-8');
            drafts = JSON.parse(data);
        } catch (error) {
            return NextResponse.json({ error: "Drafts file not found" }, { status: 404 });
        }

        const newDrafts = drafts.filter((p: any) => p.id !== id);

        if (drafts.length === newDrafts.length) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await fs.writeFile(draftsPath, JSON.stringify(newDrafts, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
