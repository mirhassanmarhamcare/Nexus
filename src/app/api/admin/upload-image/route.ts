import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from 'octokit';

export async function POST(request: Request) {
    // 1. Check Authentication
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { image } = await request.json(); // Base64 string
        if (!image) return NextResponse.json({ error: "No image data" }, { status: 400 });

        // 2. Validate Env Vars
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const REPO_OWNER = process.env.REPO_OWNER;
        const REPO_NAME = process.env.REPO_NAME;

        if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        const octokit = new Octokit({ auth: GITHUB_TOKEN });

        // 3. Prepare File
        // Remove data:image/webp;base64, prefix
        const base64Content = image.split(',')[1];
        const fileName = `upload-${Date.now()}.webp`;
        const path = `public/uploads/${fileName}`;

        // 4. Upload to GitHub
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: path,
            message: `Upload Image: ${fileName}`,
            content: base64Content,
            committer: {
                name: "Nexus Admin Bot",
                email: "admin@nexus.com"
            }
        });

        // 5. Return the public URL
        // Currently assuming serving from same domain/public folder
        return NextResponse.json({ url: `/uploads/${fileName}` });

    } catch (error: any) {
        console.error("Image Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
    }
}
