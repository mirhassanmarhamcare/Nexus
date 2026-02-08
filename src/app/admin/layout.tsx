"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";



export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();



    // Simple check to see if we are on the login page

    if (pathname === '/admin/login') return <>{children}</>;



    return (

        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">

            {/* Top Navigation Bar - Fixed, High Z-Index */}

            <header className="fixed top-0 left-0 w-full h-16 bg-black/90 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6 md:px-12">



                {/* Left: Logo Area - Flex Start */}

                <div className="flex-1 flex items-center justify-start min-w-0">

                    <div className="flex items-center gap-3">

                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 text-[#D4AF37]">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M232,128a104,104,0,1,1-104-104A104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>

                        </div>

                        <span className="text-lg font-display font-bold tracking-wider text-white whitespace-nowrap">NEXUS ADMIN</span>

                    </div>

                </div>



                {/* Center: Navigation Links - Flex Center */}

                <nav className="hidden md:flex flex-1 items-center justify-center gap-6 min-w-0">

                    <TopNavLink href="/admin" label="Dashboard" active={pathname === '/admin'} />

                    <TopNavLink href="/admin/orders" label="Orders" active={pathname.startsWith('/admin/orders')} />

                    <TopNavLink href="/admin/media" label="Media" active={pathname === '/admin/media'} />

                    <TopNavLink href="/admin/settings" label="Settings" active={pathname === '/admin/settings'} />

                </nav>



                {/* Right: Actions - Flex End */}

                <div className="flex-1 flex items-center justify-end min-w-0 gap-4">

                    <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all whitespace-nowrap">

                        <span className="hidden lg:inline">View Store</span>

                        <span className="text-lg leading-none">↗</span>

                    </Link>

                </div>

            </header>



            {/* Main Content - Padded top for fixed header, centered max-width */}

            <main className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen relative z-10">

                {children}

            </main>

        </div>

    );

}



function TopNavLink({ href, label, active }: { href: string, label: string, active: boolean }) {

    return (

        <Link

            href={href}

            className={`

                relative text-sm font-bold uppercase tracking-widest transition-colors py-2

                ${active ? 'text-[#D4AF37]' : 'text-zinc-500 hover:text-white'}

            `}

        >

            {label}

            {active && (

                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span>

            )}

        </Link>

    );

}