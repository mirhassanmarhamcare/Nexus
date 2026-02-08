"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import draftsData from "@/data/drafts.json";
import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import MediaLibrary from "./media/page";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'drafts' | 'categories' | 'media' | 'promos' | 'customers' | 'drops'>('analytics');
    const [categories, setCategories] = useState(categoriesData);
    const [publishing, setPublishing] = useState(false);
    const [message, setMessage] = useState("");
    const [creating, setCreating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [analytics, setAnalytics] = useState<any>(null);
    const [promos, setPromos] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/admin/analytics");
            if (res.ok) setAnalytics(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchPromos = async () => {
        const res = await fetch("/api/admin/promos");
        if (res.ok) setPromos(await res.json());
    };

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/admin/customers");
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error("Failed to load customers", error);
        }
    };

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/admin/activity-hub");
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to load activity", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) setSettings(await res.json());
        } catch (err) { console.error(err); }
    };

    const toggleDirective = async (key: string) => {
        if (!settings) return;
        const updatedSettings = { ...settings, [key]: !settings[key] };
        setSettings(updatedSettings); // Optimistic update
        try {
            await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSettings),
            });
        } catch (err) {
            console.error("Failed to update directive", err);
            fetchSettings(); // Revert on failure
        }
    };

    useEffect(() => {
        if (activeTab === 'analytics') {
            fetchAnalytics();
            fetchActivities();
            fetchSettings();
        }
        if (activeTab === 'promos') fetchPromos();
        if (activeTab === 'customers') fetchCustomers();
    }, [activeTab]);

    const handlePublish = async () => {
        if (!confirm("Are you sure? This will push all DRAFTS to the LIVE SITE.")) return;

        setPublishing(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/publish", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                setMessage("Success! Changes published to live site.");
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage("Failed to connect to server");
        } finally {
            setPublishing(false);
        }
    };

    const handleSaveCategories = async () => {
        setPublishing(true); // Re-use publishing state for loading
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(categories),
            });
            if (res.ok) {
                setMessage("Success! Categories updated.");
                // We need the page to refresh or state to update to see changes elsewhere
                window.location.reload();
            } else {
                setMessage("Failed to save categories");
            }
        } catch (err) {
            setMessage("Error connecting to server");
        } finally {
            setPublishing(false);
        }
    };

    const moveCategory = (index: number, direction: 'up' | 'down') => {
        const sortedCats = [...categories].sort((a, b) => a.order - b.order);
        if (direction === 'up' && index > 0) {
            [sortedCats[index - 1], sortedCats[index]] = [sortedCats[index], sortedCats[index - 1]];
        } else if (direction === 'down' && index < sortedCats.length - 1) {
            [sortedCats[index + 1], sortedCats[index]] = [sortedCats[index], sortedCats[index + 1]];
        }

        // Update order values based on new indices
        const updatedCats = sortedCats.map((cat, i) => ({ ...cat, order: i }));
        setCategories(updatedCats);
    };

    const handleCreateProduct = async () => {
        setCreating(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/create-product", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                // Redirect to new product
                window.location.href = `/admin/product/${data.id}`;
            } else {
                setMessage(`Error: ${data.error}`);
                setCreating(false);
            }
        } catch (error) {
            setMessage("Failed to connect to server");
            setCreating(false);
        }
    };

    // Unified Inventory View
    const allInventory = (() => {
        const merged = [...productsData];
        draftsData.forEach((draft: any) => {
            const idx = merged.findIndex(p => p.id === (draft.id || draft.productCode));
            if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...draft };
            } else {
                merged.push(draft);
            }
        });
        return merged;
    })();

    return (
        <div className="text-white">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Overview</h1>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400 tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                        STAGING ENVIRONMENT
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCreateProduct}
                        disabled={creating}
                        className="group flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider text-xs border border-white/10 transition-all hover:border-[#D4AF37]/50"
                    >
                        {creating ? (
                            <span className="animate-spin text-[#D4AF37]">⟳</span>
                        ) : (
                            <span className="text-[#D4AF37] text-lg leading-none">+</span>
                        )}
                        {creating ? "Creating..." : "New Product"}
                    </button>

                    <Link
                        href="/"
                        target="_blank"
                        className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider text-xs border border-white/10 transition-all hover:border-white/30"
                    >
                        Live Site ↗
                    </Link>

                    <Link
                        href="/shop"
                        target="_blank"
                        className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider text-xs border border-white/10 transition-all hover:border-white/30"
                    >
                        Store ↗
                    </Link>

                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="px-6 py-3 bg-[#D4AF37] text-black font-[900] uppercase tracking-[0.2em] text-xs hover:bg-[#F4CF57] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                    >
                        {publishing ? "Publishing..." : "Commit Changes"}
                    </button>
                </div>
            </header>

            {message && (
                <div className={`mb-8 p-4 rounded border ${message.includes("Success") ? "bg-green-900/20 border-green-900/50 text-green-200" : "bg-red-900/20 border-red-900/50 text-red-200 uppercase tracking-widest text-[10px] font-bold"}`}>
                    {message}
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
                <div className="bg-zinc-900/40 p-6 rounded-sm border border-white/5 backdrop-blur-sm">
                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Total Drafts</div>
                    <div className="text-3xl font-display text-white">{draftsData.length}</div>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-sm border border-white/5 backdrop-blur-sm">
                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Live Items</div>
                    <div className="text-3xl font-display text-gray-500">{productsData.length}</div>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-sm border border-white/5 backdrop-blur-sm">
                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Categories</div>
                    <div className="text-3xl font-display text-white">{categoriesData.length}</div>
                </div>
                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 rounded-sm border border-[#D4AF37]/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-[#D4AF37] text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Staging Status</div>
                        <div className="text-3xl font-display text-[#D4AF37]">{draftsData.length} UPDATES</div>
                        <div className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest font-bold group-hover:text-gray-400 transition-colors">Pending deployment &rarr;</div>
                    </div>
                    <div className="absolute right-[-10%] bottom-[-20%] text-9xl text-[#D4AF37]/5 font-display select-none">N</div>
                </div>
            </div>

            {/* Main Navigation Tabs */}
            <div className="flex gap-12 mb-10 border-b border-white/10 max-w-7xl mx-auto px-2">
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'analytics' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Analytics
                    {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'drafts' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Working Drafts
                    {activeTab === 'drafts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'categories' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Manage Categories
                    {activeTab === 'categories' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'media' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Media Library
                    {activeTab === 'media' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('promos')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'promos' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Promotions
                    {activeTab === 'promos' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('customers')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'customers' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Customers
                    {activeTab === 'customers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('drops')}
                    className={`pb-4 text-xs uppercase tracking-[0.25em] font-black transition-all relative ${activeTab === 'drops' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    Drops
                    {activeTab === 'drops' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}
                </button>
            </div>

            <main className="max-w-7xl mx-auto min-h-[60vh]">
                {/* Analytics Section */}
                {activeTab === 'analytics' && !analytics && (
                    <div className="flex flex-col items-center justify-center py-48 gap-6 animate-pulse">
                        <div className="w-12 h-12 border border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Nexus Core</span>
                            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Synchronizing System Vitality...</span>
                        </div>
                    </div>
                )}
                {activeTab === 'analytics' && analytics && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {/* Live Status Bar */}
                        <div className="flex flex-col md:flex-row gap-8 mb-12">
                            <div className="flex-1 bg-zinc-900/40 border border-[#D4AF37]/10 p-8 rounded-sm flex items-center justify-between relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System Vitality / LIVE</span>
                                    </div>
                                    <div className="text-4xl font-display text-[#D4AF37]">NEXUS CORE ACTIVE</div>
                                </div>
                                <div className="text-right relative z-10">
                                    <span className="text-[10px] text-gray-600 block mb-1 uppercase tracking-widest">Active Seekers</span>
                                    <span className="text-2xl font-display text-white italic">08</span>
                                </div>
                                <div className="absolute right-[-20px] top-[-20px] text-9xl text-white/[0.02] font-display select-none pointer-events-none group-hover:text-[#D4AF37]/5 transition-all">A</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Dashboard Primary Feed */}
                            <div className="lg:col-span-3 space-y-12">
                                {/* Revenue & Performance */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 border border-white/5 bg-zinc-900/20 rounded-sm">
                                        <div className="flex justify-between items-baseline mb-8">
                                            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Revenue Attribution</h3>
                                            <span className="text-[9px] text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1">Weekly Delta: +14%</span>
                                        </div>
                                        <div className="flex items-baseline gap-4 mb-4">
                                            <span className="text-4xl font-display text-white">Rs. {analytics.reports.revenue.total.toLocaleString()}</span>
                                            <span className="text-xs text-gray-600 font-mono italic">Valuation (PKR)</span>
                                        </div>
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>

                                    <div className="p-8 border border-white/5 bg-zinc-900/20 rounded-sm">
                                        <div className="flex justify-between items-baseline mb-8">
                                            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Conversion Coefficient</h3>
                                            <span className="text-[9px] text-gray-700 uppercase tracking-widest">Target: 4.5%</span>
                                        </div>
                                        <div className="flex items-baseline gap-4 mb-4">
                                            <span className="text-4xl font-display text-white">3.82%</span>
                                            <span className="text-xs text-gray-600 font-mono italic">Yield Index</span>
                                        </div>
                                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Atelier Activity Hub */}
                                <div className="bg-zinc-900/10 border border-white/5 p-8 rounded-sm">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-xl font-display uppercase tracking-widest text-white">Atelier Activity Hub</h2>
                                            <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-1">Real-time chronicle of system directive execution</p>
                                        </div>
                                        <button className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/20 px-4 py-2 hover:bg-[#D4AF37] hover:text-black transition-all">Clear Logs</button>
                                    </div>

                                    <div className="space-y-4">
                                        {activities.map((act) => (
                                            <div key={act.id} className="flex items-center gap-6 p-5 border border-white/[0.03] bg-zinc-900/40 rounded-sm group hover:border-white/10 transition-all cursor-default">
                                                <div className={`w-2 h-2 rounded-full ${act.color} group-hover:animate-ping`}></div>
                                                <div className="w-16 text-[8px] font-mono text-gray-700 uppercase tracking-tighter">{act.type}</div>
                                                <div className="flex-1">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest mr-4">{act.title}</span>
                                                    <span className="text-[10px] text-gray-500">{act.detail}</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-gray-700">{act.time}</div>
                                            </div>
                                        ))}

                                        {activities.length === 0 && (
                                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-spin duration-[10s]">
                                                    <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                                                </div>
                                                <p className="text-[10px] text-gray-700 uppercase tracking-widest font-black italic">Synchronizing with system timeline...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Directives (Side Panel) */}
                            <div className="space-y-8">
                                <div className="p-8 border border-white/5 bg-zinc-900/40 rounded-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Directives</h3>

                                    <div className="space-y-6">
                                        <div onClick={() => toggleDirective('maintenanceMode')} className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <div className="text-[10px] text-white uppercase tracking-[0.2em] mb-1">Maintenance</div>
                                                <div className="text-[8px] text-gray-600 uppercase">Lock and Dark Store</div>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full border border-white/10 relative p-1 transition-all ${settings?.maintenanceMode ? 'bg-red-500/20 border-red-500/40' : 'bg-zinc-800'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all ${settings?.maintenanceMode ? 'bg-red-500 translate-x-5 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-700'}`}></div>
                                            </div>
                                        </div>

                                        <div onClick={() => toggleDirective('stagingMarquee')} className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <div className="text-[10px] text-white uppercase tracking-[0.2em] mb-1">Staging Marquee</div>
                                                <div className="text-[8px] text-gray-600 uppercase">Scroll Staging Text</div>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full border border-white/10 relative p-1 transition-all ${settings?.stagingMarquee ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40' : 'bg-zinc-800'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all ${settings?.stagingMarquee ? 'bg-[#D4AF37] translate-x-5 shadow-[0_0_10px_#D4AF37]' : 'bg-gray-700'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between group opacity-50 cursor-not-allowed">
                                            <div>
                                                <div className="text-[10px] text-white uppercase tracking-[0.2em] mb-1">Global Drop</div>
                                                <div className="text-[8px] text-gray-600 uppercase">Trigger Global Launch</div>
                                            </div>
                                            <div className="w-10 h-5 bg-zinc-800 rounded-full border border-white/10 relative p-1">
                                                <div className="w-2.5 h-2.5 bg-gray-700 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-700 block mb-4 italic">Security Context</span>
                                        <div className="flex justify-between items-center bg-black/40 p-4 rounded-sm border border-white/5">
                                            <span className="text-[8px] text-gray-600 uppercase font-mono">ENCRYPTED_SHELL</span>
                                            <span className="text-[10px] text-white font-mono uppercase tracking-[0.3em]">ACTIVE</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border border-white/5 bg-zinc-900/20 rounded-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Archive Pulse</h3>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-gray-700 uppercase font-black tracking-widest">Full Integrity</span>
                                            <span className="text-xl font-display text-white">99.8%</span>
                                        </div>
                                        <div className="h-0.5 w-full bg-zinc-800">
                                            <div className="h-full bg-zinc-500" style={{ width: '99%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'drafts' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-display uppercase tracking-widest mb-1 text-white">Full Change Log</h2>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Listing every modified product in the current staging session</p>
                            </div>
                            <div className="h-px flex-1 mx-8 bg-white/5"></div>
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-[#D4AF37] block mb-1">UNCOMMITTED CHANGES</span>
                                <span className="text-xl font-display text-white">{draftsData.length}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            {draftsData.length === 0 ? (
                                <div className="text-center py-32 border border-dashed border-white/5 rounded-sm">
                                    <p className="text-gray-600 uppercase tracking-widest text-xs">No pending changes found.</p>
                                </div>
                            ) : (
                                [...draftsData].sort((a: any, b: any) => {
                                    const pA = a.priority || 0;
                                    const pB = b.priority || 0;
                                    if (pA === 0 && pB === 0) return 0;
                                    if (pA === 0) return 1;
                                    if (pB === 0) return -1;
                                    return pA - pB;
                                }).map((product: any) => (
                                    <Link
                                        href={`/admin/product/${product.id}`}
                                        key={product.id}
                                        className="group flex items-center justify-between p-7 bg-zinc-900/20 border-b border-white/5 hover:bg-zinc-900/50 hover:border-[#D4AF37]/30 transition-all"
                                    >
                                        <div className="flex items-center gap-10">
                                            <div className="w-20 h-20 relative bg-black/40 rounded-sm overflow-hidden border border-white/5 group-hover:border-[#D4AF37]/20 transition-all">
                                                {product.images?.[0] && (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">{product.category}</div>
                                                <h3 className="font-display text-xl text-white group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="text-[9px] px-2 py-0.5 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full font-bold uppercase tracking-widest">
                                                        Priority: {product.priority || 0}
                                                    </span>
                                                    <span className="text-[9px] px-2 py-0.5 border border-white/10 text-gray-500 rounded-full font-bold uppercase tracking-widest">
                                                        Code: {product.productCode || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12">
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1">Base Price</div>
                                                <span className="font-mono text-white text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
                                            </div>
                                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L204.69,128,138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Manage Categories Section */}
                {activeTab === 'categories' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Left Pane: Categories List & Order */}
                            <div className="lg:col-span-1 space-y-10">
                                <div>
                                    <div className="flex justify-between items-center mb-6 border-l-2 border-[#D4AF37] pl-4">
                                        <h2 className="text-lg font-display uppercase tracking-widest text-white">All Filters</h2>
                                        <button
                                            onClick={() => {
                                                const name = prompt("Enter new category name:");
                                                if (name) {
                                                    const id = name.toLowerCase().replace(/ /g, '-');
                                                    const newCat = { id, name, order: categories.length };
                                                    setCategories([...categories, newCat]);
                                                }
                                            }}
                                            className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-[#D4AF37] px-2 py-1 rounded border border-white/5 transition-colors"
                                        >
                                            + ADD
                                        </button>
                                    </div>
                                    <div className="bg-zinc-900/30 rounded-sm border border-white/5 overflow-hidden">
                                        {categories.sort((a, b) => a.order - b.order).map((cat, idx) => (
                                            <div
                                                key={cat.id}
                                                className={`w-full flex items-center justify-between p-4 border-b border-white/5 transition-all group ${(selectedCategory === cat.name || (cat.name === 'All' && selectedCategory === null))
                                                    ? 'bg-zinc-800 text-white'
                                                    : 'text-gray-500 hover:bg-zinc-900/50 hover:text-gray-300'
                                                    }`}
                                            >
                                                <button
                                                    onClick={() => setSelectedCategory(cat.name === 'All' ? null : cat.name)}
                                                    className="flex-1 flex items-center gap-3 text-left"
                                                >
                                                    <span className="text-[10px] font-mono opacity-30">{idx + 1}</span>
                                                    <span className="text-[11px] uppercase tracking-widest font-black leading-none">{cat.name}</span>
                                                </button>

                                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                    {cat.id !== 'all' && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newName = prompt("Rename category:", cat.name);
                                                                    if (newName && newName !== cat.name) {
                                                                        const updated = categories.map(c => c.id === cat.id ? { ...c, name: newName } : c);
                                                                        setCategories(updated);
                                                                    }
                                                                }}
                                                                className="text-gray-500 hover:text-white"
                                                                title="Rename"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm(`Delete category "${cat.name}"?`)) {
                                                                        const updated = categories.filter(c => c.id !== cat.id);
                                                                        setCategories(updated);
                                                                        if (selectedCategory === cat.name) setSelectedCategory(null);
                                                                    }
                                                                }}
                                                                className="text-gray-500 hover:text-red-500"
                                                                title="Delete"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                    <div className="flex flex-col gap-0.5 border-l border-white/10 pl-2">
                                                        <span onClick={(e) => { e.stopPropagation(); moveCategory(idx, 'up'); }} className="hover:text-[#D4AF37] cursor-pointer text-[10px]" title="Move Up">▲</span>
                                                        <span onClick={(e) => { e.stopPropagation(); moveCategory(idx, 'down'); }} className="hover:text-[#D4AF37] cursor-pointer text-[10px]" title="Move Down">▼</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleSaveCategories}
                                        className="w-full mt-4 py-3 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Right Pane: Product Explorer */}
                            <div className="lg:col-span-3">
                                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 pb-4 border-b border-white/5 gap-6">
                                    <div className="flex items-baseline gap-4">
                                        <h2 className="text-3xl font-display uppercase tracking-widest text-[#D4AF37]">
                                            {selectedCategory || "Full Inventory"}
                                        </h2>
                                        <span className="text-xs text-gray-600 font-mono tracking-widest">
                                            [{allInventory.filter((p: any) => !selectedCategory || p.category === selectedCategory).length} ITEMS]
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                                        <div className="relative w-full md:w-64 group">
                                            <input
                                                type="text"
                                                placeholder="SEARCH PRODUCTS..."
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-full px-5 py-2 text-[10px] font-mono text-white outline-none focus:border-[#D4AF37] transition-all"
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-[#D4AF37] transition-colors" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold hidden xl:block">
                                            Sort: Priority (Primary)
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allInventory
                                        .filter((p: any) => (!selectedCategory || p.category === selectedCategory) &&
                                            (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.productCode?.toLowerCase().includes(searchQuery.toLowerCase()))
                                        )
                                        .sort((a: any, b: any) => {
                                            const pA = a.priority || 0;
                                            const pB = b.priority || 0;
                                            if (pA === 0 && pB === 0) return 0;
                                            if (pA === 0) return 1;
                                            if (pB === 0) return -1;
                                            return pA - pB;
                                        })
                                        .map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/admin/product/${product.id}`}
                                                className="group bg-zinc-900/40 border border-white/5 p-5 flex gap-5 hover:border-[#D4AF37]/5 transition-all relative overflow-hidden"
                                            >
                                                <div className="w-24 h-24 bg-white/5 rounded-sm overflow-hidden flex-shrink-0 relative">
                                                    {product.images?.[0] && (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                    <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 text-[8px] font-mono text-[#D4AF37] rounded-sm">
                                                        #{product.priority || 0}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-between py-1 overflow-hidden">
                                                    <div>
                                                        <h4 className="text-sm font-display uppercase tracking-wider text-white mb-1 group-hover:text-[#D4AF37] transition-colors truncate">{product.name}</h4>
                                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">{product.category}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-mono text-[#D4AF37]">Rs. {product.price.toLocaleString()}</span>
                                                        <span className="text-[9px] text-gray-700 uppercase tracking-widest font-black group-hover:text-white transition-colors">Edit &rarr;</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                    {draftsData.filter((p: any) => !selectedCategory || p.category === selectedCategory).length === 0 && (
                                        <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-sm text-gray-600 uppercase tracking-[0.2em] text-xs">
                                            No products found in this category.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <MediaLibrary />
                    </div>
                )}

                {activeTab === 'promos' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
                            <div>
                                <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Promotions</h1>
                                <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase italic">Exclusive Reward Management</p>
                            </div>
                            <button
                                onClick={async () => {
                                    const code = prompt("Enter Promo Code (e.g. SUMMER25):");
                                    if (code) {
                                        const type = prompt("Type (percentage/fixed):", "percentage");
                                        const value = Number(prompt("Value (number):", "10"));
                                        await fetch("/api/admin/promos", {
                                            method: "POST",
                                            body: JSON.stringify({ code, type, value, minOrder: 0, description: "Direct Admin Creation", isActive: true })
                                        });
                                        fetchPromos();
                                    }
                                }}
                                className="px-6 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs hover:bg-[#F4CF57] shadow-xl"
                            >
                                + New Offer
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {promos.map((promo, idx) => (
                                <div key={idx} className="bg-zinc-900/40 border border-white/5 p-8 rounded-sm group relative overflow-hidden transition-all hover:border-[#D4AF37]/30">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-[0.2em] block mb-2">{promo.type} reduction</span>
                                            <h3 className="text-2xl font-display text-white tracking-widest">{promo.code}</h3>
                                        </div>
                                        <div className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest ${promo.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {promo.isActive ? 'ACTIVE' : 'DORMANT'}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider leading-relaxed">{promo.description}</p>
                                        <div className="flex justify-between items-baseline py-4 border-y border-white/5">
                                            <span className="text-[9px] text-gray-600 uppercase font-black">Value</span>
                                            <span className="text-xl font-display text-white">{promo.type === 'percentage' ? `${promo.value}%` : `Rs. ${promo.value}`}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={async () => {
                                                await fetch("/api/admin/promos", {
                                                    method: "POST",
                                                    body: JSON.stringify({ ...promo, isActive: !promo.isActive })
                                                });
                                                fetchPromos();
                                            }}
                                            className="flex-1 py-3 bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest border border-white/5 hover:bg-zinc-700 transition-colors"
                                        >
                                            {promo.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (confirm(`Erase promo ${promo.code}?`)) {
                                                    await fetch(`/api/admin/promos?code=${promo.code}`, { method: "DELETE" });
                                                    fetchPromos();
                                                }
                                            }}
                                            className="px-4 py-3 bg-red-900/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-900/20 hover:bg-red-900/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-8xl font-display select-none group-hover:opacity-[0.06] transition-opacity">
                                        %
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Customer content is already there */}
                    </div>
                )}

                {activeTab === 'drops' && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
                            <div>
                                <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Atelier Schedule</h1>
                                <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase italic">Product Launch Timeline & Drop Management</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-sm">
                                <span className="text-[9px] text-[#D4AF37] uppercase font-black tracking-widest block mb-1">Upcoming Drops</span>
                                <span className="text-xl font-display text-white">
                                    {[...productsData, ...draftsData].filter((p: any) => p.isDrop && new Date(p.dropDate) > new Date()).length}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[...productsData, ...draftsData]
                                .filter((p: any) => p.isDrop)
                                .sort((a: any, b: any) => new Date(a.dropDate).getTime() - new Date(b.dropDate).getTime())
                                .map((product: any, idx: number) => {
                                    const dropDate = new Date(product.dropDate);
                                    const now = new Date();
                                    const isLive = dropDate <= now;
                                    const timeLeft = dropDate.getTime() - now.getTime();

                                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                                    return (
                                        <div key={idx} className="bg-zinc-900/20 border border-white/5 p-8 rounded-sm group hover:bg-zinc-800/20 transition-all flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                                            {isLive && <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>}
                                            {!isLive && <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>}

                                            <div className="flex items-center gap-8 w-full md:w-1/3">
                                                <div className="w-16 h-16 bg-zinc-800 rounded-sm overflow-hidden border border-white/5 shrink-0 relative">
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-display text-white tracking-widest uppercase mb-1">{product.name}</h3>
                                                    <span className="text-[8px] font-mono text-gray-500 uppercase">{product.category} • Rs. {product.price?.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-start md:w-1/3">
                                                <span className="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-3">Launch Window</span>
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-display text-white uppercase tracking-tight">
                                                        {dropDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">
                                                        AT {dropDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center md:items-end w-full md:w-1/3">
                                                <div className="flex items-center gap-4 mb-4">
                                                    {isLive ? (
                                                        <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/30 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                            <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                                                            LIVE COLLECTION
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-[8px] font-black uppercase tracking-widest rounded-full">
                                                            LAUNCH IN {days}D {hours}H
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-black text-white hover:text-[#D4AF37] transition-colors border-b border-white/10 pb-1 cursor-pointer">
                                                    MANAGE DROP &rarr;
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                            {[...productsData, ...draftsData].filter((p: any) => p.isDrop).length === 0 && (
                                <div className="py-32 text-center border border-dashed border-white/5 rounded-sm">
                                    <p className="text-gray-600 uppercase tracking-widest text-[10px] mb-4">The Atelier is currently quiet...</p>
                                    <p className="text-gray-700 text-[8px] uppercase">Initialize a drop in the product editor to schedule a launch.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

