import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROMO_PATH = path.join(process.cwd(), 'src', 'data', 'promos.json');

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        let promos = [];
        try {
            const data = await fs.readFile(PROMO_PATH, 'utf8');
            promos = JSON.parse(data);
        } catch {
            return NextResponse.json({ error: "Invalid code" }, { status: 404 });
        }

        const promo = promos.find((p: any) => p.code.toUpperCase() === code.toUpperCase());

        if (!promo) return NextResponse.json({ error: "Code unknown" }, { status: 404 });
        if (!promo.isActive) return NextResponse.json({ error: "Code expired" }, { status: 400 });
        if (promo.minOrder && cartTotal < promo.minOrder) {
            return NextResponse.json({ error: `Min. order Rs. ${promo.minOrder} required` }, { status: 400 });
        }

        return NextResponse.json({
            valid: true,
            promo: {
                code: promo.code,
                type: promo.type,
                value: promo.value
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Validation failed" }, { status: 500 });
    }
}
