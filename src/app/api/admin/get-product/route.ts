
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');
        const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');

        let drafts = [];
        try {
            const data = await fs.readFile(draftsPath, 'utf-8');
            drafts = JSON.parse(data);
        } catch (e) {
            drafts = [];
        }

        let products = [];
        try {
            const data = await fs.readFile(productsPath, 'utf-8');
            products = JSON.parse(data);
        } catch (e) {
            products = [];
        }

        // Check drafts first, then live products
        const product = drafts.find((p: any) => p.id === id) || products.find((p: any) => p.id === id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
