import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROMO_PATH = path.join(process.cwd(), 'src', 'data', 'promos.json');

async function getPromos() {
    try {
        const data = await fs.readFile(PROMO_PATH, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function GET() {
    return NextResponse.json(await getPromos());
}

export async function POST(request: Request) {
    try {
        const newPromo = await request.json();
        const promos = await getPromos();

        // Update if exists, else add
        const index = promos.findIndex((p: any) => p.code === newPromo.code);
        if (index !== -1) {
            promos[index] = newPromo;
        } else {
            promos.push(newPromo);
        }

        await fs.writeFile(PROMO_PATH, JSON.stringify(promos, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save promo" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    try {
        const promos = await getPromos();
        const updated = promos.filter((p: any) => p.code !== code);
        await fs.writeFile(PROMO_PATH, JSON.stringify(updated, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
