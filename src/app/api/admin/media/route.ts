import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const productsDir = path.join(process.cwd(), 'public', 'Products');
        const mediaFiles: string[] = [];

        const scanDir = (dir: string) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanDir(fullPath);
                } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item)) {
                    // Convert absolute path to public URL
                    const relativePath = path.relative(path.join(process.cwd(), 'public'), fullPath);
                    mediaFiles.push('/' + relativePath.replace(/\\/g, '/'));
                }
            }
        };

        if (fs.existsSync(productsDir)) {
            scanDir(productsDir);
        }

        return NextResponse.json({ media: mediaFiles });
    } catch (error) {
        console.error('Media fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
    }
}
