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
        const { image } = await request.json(); // Base64 string
        if (!image) return NextResponse.json({ error: "No image data" }, { status: 400 });

        // 2. Prepare File
        // Remove data:image/webp;base64, prefix
        const base64Content = image.split(',')[1];
        const buffer = Buffer.from(base64Content, 'base64');
        const fileName = `upload-${Date.now()}.webp`;

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // 3. Save to local public/uploads
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        // 4. Return the public URL
        return NextResponse.json({ url: `/uploads/${fileName}` });

    } catch (error: any) {
        console.error("Image Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
    }
}
