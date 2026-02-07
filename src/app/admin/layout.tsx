"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Simple check to see if we are on the login page
    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col fixed h-full bg-zinc-950">
                <div className="p-8 border-b border-white/10">
                    <h1 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]">Nexus Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`block px-4 py-3 rounded text-sm uppercase tracking-wider transition-colors ${pathname === '/admin' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/media"
                        className={`block px-4 py-3 rounded text-sm uppercase tracking-wider transition-colors ${pathname === '/admin/media' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Media Library
                    </Link>
                    <Link
                        href="/admin/settings"
                        className={`block px-4 py-3 rounded text-sm uppercase tracking-wider transition-colors ${pathname === '/admin/settings' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" target="_blank" className="block px-4 py-3 text-center text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        Open Live Site &rarr;
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
