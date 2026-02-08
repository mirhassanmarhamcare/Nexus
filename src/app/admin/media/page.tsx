"use client";

import { useState, useEffect } from "react";

interface MediaAsset {
    url: string;
    type: string;
    usage: string[];
}

export default function MediaLibrary() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFolder, setActiveFolder] = useState<string>("ALL");
    const [copying, setCopying] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch("/api/admin/media");
                if (res.ok) {
                    const data = await res.json();
                    if (data.media) {
                        const mapped: MediaAsset[] = data.media.map((url: string) => {
                            const parts = url.split('/');
                            let type = "OTHER";
                            if (parts.includes("womensshoes")) type = "SHOES";
                            if (parts.includes("menshoes")) type = "SHOES";
                            if (parts.includes("jewelry")) type = "JEWELRY";
                            if (parts.includes("menwallets")) type = "WALLETS";
                            if (parts.includes("womenhandbags")) type = "HANDBAGS";
                            if (parts.includes("uploads")) type = "UPLOAD";

                            return {
                                url,
                                type,
                                usage: [] // Usage tracking deferred to next iteration
                            };
                        });
                        setAssets(mapped);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopying(url);
        setTimeout(() => setCopying(null), 2000);
    };

    const [bulkCopying, setBulkCopying] = useState(false);

    const copyAllUrls = () => {
        const urls = filteredAssets.map(a => a.url).join("\n");
        navigator.clipboard.writeText(urls);
        setBulkCopying(true);
        setTimeout(() => setBulkCopying(false), 3000);
    };

    const folders = [
        { id: "ALL", label: "All Assets", icon: "▦" },
        { id: "SHOES", label: "Footwear", icon: "👞" },
        { id: "JEWELRY", label: "Fine Jewelry", icon: "✨" },
        { id: "WALLETS", label: "Accessories", icon: "👛" },
        { id: "HANDBAGS", label: "Leather Goods", icon: "👜" },
        { id: "UPLOAD", label: "Studio Uploads", icon: "✦" },
    ];

    const filteredAssets = assets.filter(asset => {
        const matchesFolder = activeFolder === "ALL" || asset.type === activeFolder;
        const matchesSearch = asset.url.toLowerCase().includes(search.toLowerCase()) ||
            asset.usage.some(p => p.toLowerCase().includes(search.toLowerCase()));
        return matchesFolder && matchesSearch;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Indexing Atelier Assets...</p>
        </div>
    );

    return (
        <div className="text-white">
            <header className="mb-12 border-b border-white/10 pb-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Media Library</h1>
                        <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase italic">Visual Resource Management</p>
                    </div>

                    <div className="relative w-full md:w-auto flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="SEARCH BY FILENAME OR PRODUCT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 bg-zinc-900/50 border border-white/10 rounded-full px-6 py-2.5 text-[10px] font-mono text-white outline-none focus:border-[#D4AF37] transition-all"
                        />
                        <button
                            onClick={copyAllUrls}
                            disabled={filteredAssets.length === 0}
                            className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${bulkCopying
                                ? "bg-green-600 border-green-600 text-white"
                                : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                                }`}
                        >
                            <span>{bulkCopying ? "✓" : "☍"}</span>
                            {bulkCopying ? "MANIFEST COPIED" : "BULK ARCHIVE"}
                        </button>
                    </div>
                </div>

                {/* Virtual Folders / Tabs */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {folders.map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => setActiveFolder(folder.id)}
                            className={`flex items-center gap-3 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFolder === folder.id
                                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                : "bg-black/40 text-gray-500 border-white/5 hover:border-white/20 hover:text-white"
                                }`}
                        >
                            <span className="text-sm">{folder.icon}</span>
                            {folder.label}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-sm text-[8px] ${activeFolder === folder.id ? 'bg-black/20 text-black' : 'bg-white/5 text-gray-600'}`}>
                                {assets.filter(a => folder.id === "ALL" || a.type === folder.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </header>

            {filteredAssets.length === 0 ? (
                <div className="p-32 border border-dashed border-white/5 bg-zinc-900/10 rounded text-center">
                    <div className="text-4xl opacity-10 mb-4">ø</div>
                    <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px]">No assets found in the selected ledger.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredAssets.map((asset, i) => (
                        <div
                            key={i}
                            className="group relative flex flex-col gap-3 animate-in fade-in duration-500"
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div
                                className="relative aspect-square bg-black border border-white/5 overflow-hidden group-hover:border-[#D4AF37]/50 transition-all cursor-pointer shadow-xl"
                                onClick={() => copyToClipboard(asset.url)}
                            >
                                <img
                                    src={asset.url}
                                    alt={`Asset ${i}`}
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                                />

                                {/* Hover Info Overlay */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-4">
                                        <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">In Use By</p>
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {asset.usage.slice(0, 3).map((u, idx) => (
                                                <span key={idx} className="text-[9px] text-white font-display uppercase tracking-wider">{u}{idx < asset.usage.length - 1 && asset.usage.length <= 3 ? "," : ""}</span>
                                            ))}
                                            {asset.usage.length > 3 && <span className="text-[9px] text-gray-500">+{asset.usage.length - 3}</span>}
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${copying === asset.url ? 'bg-green-600 text-white' : 'bg-[#D4AF37] text-black'}`}>
                                        {copying === asset.url ? 'LINK COPIED' : 'COPY ASSET URL'}
                                    </div>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-[8px] font-mono text-gray-400 border border-white/10 rounded-sm">
                                    {asset.type}
                                </div>
                            </div>

                            <div className="px-1 overflow-hidden">
                                <p className="text-[9px] font-mono text-gray-600 truncate uppercase tracking-tighter" title={asset.url}>
                                    {asset.url.split('/').pop()?.slice(0, 24) || "undefined"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center">
                <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em]">
                    Archive Integrity Checked • {filteredAssets.length} Visible
                </p>
                <div className="flex gap-4">
                    <button className="text-[9px] text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest font-black transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Scroll To Zenith</button>
                </div>
            </footer>
        </div>
    );
}
