import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from 'octokit';
import { Product } from '@/data/products';

export async function POST(request: Request) {
    // 1. Check Authentication
    const adminSession = (await cookies()).get('admin_session');
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate Env Vars
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        return NextResponse.json({ error: "Server misconfiguration: Missing GitHub Env Vars" }, { status: 500 });
    }

    try {
        const updatedProduct: Product = await request.json();
        const octokit = new Octokit({ auth: GITHUB_TOKEN });
        // CHANGED: Now writing to drafts.json
        const path = "src/data/drafts.json";

        // 3. Get current file (to get SHA)
        const { data: currentFile } = await octokit.rest.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: path,
        });

        if (!Array.isArray(currentFile) && currentFile.type === "file" && currentFile.content) {
            // 4. Decode content
            const content = Buffer.from(currentFile.content, "base64").toString("utf-8");
            const products: Product[] = JSON.parse(content);

            // 5. Update or Add the specific product
            const index = products.findIndex(p => p.id === updatedProduct.id);

            // Ensure status is draft
            updatedProduct.status = 'draft';

            if (index === -1) {
                // New product
                products.push(updatedProduct);
            } else {
                // Update existing
                products[index] = updatedProduct;
            }

            // 6. Commit changes
            const newContent = Buffer.from(JSON.stringify(products, null, 4)).toString("base64");

            await octokit.rest.repos.createOrUpdateFileContents({
                owner: REPO_OWNER,
                repo: REPO_NAME,
                path: path,
                message: `Draft Update: ${updatedProduct.name}`,
                content: newContent,
                sha: currentFile.sha,
                committer: {
                    name: "Nexus Admin Bot",
                    email: "admin@nexus.com"
                }
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Failed to fetch file from GitHub" }, { status: 502 });
        }

    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to save to GitHub" }, { status: 500 });
    }
}
