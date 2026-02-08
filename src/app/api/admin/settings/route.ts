import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');
        const data = await fs.readFile(settingsPath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const settings = await request.json();
        const settingsPath = path.join(process.cwd(), 'src', 'data', 'settings.json');

        await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Save Settings Error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
