import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from 'octokit';
import fs from 'fs/promises';
import path from 'path';
import draftsData from '@/data/drafts.json';

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

    const draftsPath = path.join(process.cwd(), 'src', 'data', 'drafts.json');
    const prodPath = path.join(process.cwd(), 'src', 'data', 'products.json');

    // LOCAL FALLBACK: If GitHub vars are missing, sync locally
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        console.warn("GitHub Env Vars missing - falling back to local sync");
        try {
            const draftsContent = await fs.readFile(draftsPath, 'utf-8');
            await fs.writeFile(prodPath, draftsContent);
            return NextResponse.json({
                success: true,
                message: "Local sync successful (GitHub variables missing, updated local products.json instead)"
            });
        } catch (err: any) {
            return NextResponse.json({ error: "Local sync failed: " + err.message }, { status: 500 });
        }
    }

    try {
        const octokit = new Octokit({ auth: GITHUB_TOKEN });
        const prodPath = "src/data/products.json";
        const draftsPath = "src/data/drafts.json";

        // 3. Get current drafts content (from file system import for now, or via GitHub if we want strictly remote)
        // For consistency, we should trust the `drafts.json` that was just committed/saved. 
        // However, in this architecture, `save-product` updates `drafts.json` on GitHub.
        // So we should fetch `drafts.json` from GitHub to be sure we have the latest committed drafts.

        const { data: draftsFile } = await octokit.rest.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: draftsPath,
        });

        if (!Array.isArray(draftsFile) && draftsFile.type === "file" && draftsFile.content) {
            const draftsContentEncoded = draftsFile.content;
            const draftsContent = Buffer.from(draftsContentEncoded, "base64").toString("utf-8");

            // 4. Get current Prod file to get its SHA for update
            const { data: prodFile } = await octokit.rest.repos.getContent({
                owner: REPO_OWNER,
                repo: REPO_NAME,
                path: prodPath,
            });

            if (!Array.isArray(prodFile) && prodFile.type === "file") {
                // 5. Overwrite products.json with drafts.json content
                await octokit.rest.repos.createOrUpdateFileContents({
                    owner: REPO_OWNER,
                    repo: REPO_NAME,
                    path: prodPath,
                    message: `PUBLISH: Syncing drafts to production`,
                    content: draftsContentEncoded, // Use same content
                    sha: prodFile.sha,
                    committer: {
                        name: "Nexus Admin Bot",
                        email: "admin@nexus.com"
                    }
                });

                return NextResponse.json({ success: true, message: "Published successfully" });
            }
        }

        return NextResponse.json({ error: "Failed to fetch files from GitHub" }, { status: 502 });

    } catch (error: any) {
        console.error("GitHub API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to publish" }, { status: 500 });
    }
}
