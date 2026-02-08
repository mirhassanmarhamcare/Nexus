"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface MediaAsset {
    url: string;
    category: string;
}

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFolder, setActiveFolder] = useState("ALL");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) {
            setLoading(true);
            fetch("/api/admin/media")
                .then(res => res.json())
                .then(data => {
                    if (data.media) {
                        const mapped: MediaAsset[] = data.media.map((url: string) => {
                            // Derive category from path
                            const parts = url.split('/');
                            let category = "OTHER";
                            if (parts.includes("womensshoes")) category = "SHOES";
                            if (parts.includes("menshoes")) category = "SHOES";
                            if (parts.includes("jewelry")) category = "JEWELRY";
                            if (parts.includes("menwallets")) category = "WALLETS";
                            if (parts.includes("womenhandbags")) category = "HANDBAGS";
                            if (parts.includes("uploads")) category = "UPLOADS";

                            return { url, category };
                        });
                        setAssets(mapped);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen || !isMounted) return null;

    const categories = ["ALL", ...Array.from(new Set(assets.map(a => a.category)))].sort();

    const filteredAssets = assets.filter(asset => {
        const matchesFolder = activeFolder === "ALL" || asset.category === activeFolder;
        const matchesSearch = asset.url.toLowerCase().includes(search.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-white/10 w-full max-w-6xl h-full max-h-[90vh] rounded-lg flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-8 bg-[#D4AF37]"></div>
                        <div>
                            <h2 className="text-xl font-display uppercase tracking-widest text-white">Media Vault</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Archived Visual Assets</p>
                        </div>
                    </div>

                    <div className="flex flex-1 max-w-md gap-4">
                        <input
                            type="text"
                            placeholder="FILTER BY FILENAME..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-full px-6 py-2 text-[10px] text-white outline-none focus:border-[#D4AF37] placeholder-gray-700"
                        />
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-zinc-950/20">
                    {categories.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFolder(f)}
                            className={`px-6 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${activeFolder === f ? "bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest animate-pulse font-mono">Cataloging Visuals...</span>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500 text-[10px] uppercase tracking-widest italic">
                            No matching assets found in the vault.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filteredAssets.map((asset, i) => (
                                <div
                                    key={i}
                                    onClick={() => onSelect(asset.url)}
                                    className="group relative aspect-square bg-[#050505] border border-white/5 overflow-hidden hover:border-[#D4AF37] transition-all cursor-pointer shadow-lg"
                                >
                                    <img src={asset.url} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <span className="text-[7px] font-mono text-gray-400 truncate w-full">
                                            {asset.url.split('/').pop()}
                                        </span>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="px-1.5 py-0.5 bg-black/80 text-[7px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 rounded-sm">
                                            {asset.category}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black text-center flex justify-between items-center px-8">
                    <span className="text-[9px] text-gray-700 uppercase tracking-widest font-mono">Vault Storage: Online</span>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest italic">nexus • digital asset management</p>
                    <span className="text-[9px] text-gray-700 uppercase tracking-widest font-mono">{filteredAssets.length} Assets Found</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
