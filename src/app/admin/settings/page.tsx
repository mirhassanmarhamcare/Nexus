"use client";

import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setMessage("Settings updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to update settings.");
            }
        } catch (error) {
            setMessage("Connection error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin text-[#D4AF37] text-4xl">⟳</div>
        </div>
    );

    return (
        <div className="text-white">
            <header className="mb-12 border-b border-white/10 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Settings</h1>
                    <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase">Global Configuration</p>
                </div>
                {message && (
                    <div className="px-6 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded animate-in fade-in slide-in-from-right-4">
                        {message}
                    </div>
                )}
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl">
                {/* Left: General & Branding */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="p-8 border border-white/5 bg-zinc-900/20 backdrop-blur-md rounded-sm">
                        <h3 className="text-xs font-black text-[#D4AF37] mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-8 h-px bg-[#D4AF37]/30"></span>
                            Store Branding
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.storeName}
                                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Base Currency</label>
                                <input
                                    type="text"
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="p-8 border border-white/5 bg-zinc-900/20 backdrop-blur-md rounded-sm">
                        <h3 className="text-xs font-black text-[#D4AF37] mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-8 h-px bg-[#D4AF37]/30"></span>
                            Customer Experience
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Announcement Bar Text</label>
                                <textarea
                                    rows={2}
                                    value={settings.announcement}
                                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all resize-none"
                                />
                                <p className="text-[9px] text-gray-600 uppercase tracking-tight">This scrolls across the top of all pages.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Shipping Threshold (PKR)</label>
                                    <input
                                        type="number"
                                        value={settings.freeShippingThreshold}
                                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 px-4 py-3 font-mono text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Default Theme</label>
                                    <select
                                        value={settings.theme}
                                        onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all appearance-none uppercase text-xs tracking-widest"
                                    >
                                        <option value="dark">Luxury Dark</option>
                                        <option value="light">Studio Light</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Contact & Support */}
                <div className="space-y-8">
                    <section className="p-8 border border-white/5 bg-zinc-900/20 backdrop-blur-md rounded-sm">
                        <h3 className="text-xs font-black text-[#D4AF37] mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-8 h-px bg-[#D4AF37]/30"></span>
                            Support Channels
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">WhatsApp Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 923123456789"
                                    value={settings.whatsapp}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 pt-4 border-t border-white/5">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Instagram URL</label>
                                <input
                                    type="text"
                                    placeholder="https://"
                                    value={settings.instagram}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Facebook URL</label>
                                <input
                                    type="text"
                                    placeholder="https://"
                                    value={settings.facebook}
                                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white rounded focus:border-[#D4AF37] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-[#F4CF57] disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                    >
                        {saving ? "Updating..." : "Push Settings Live"}
                    </button>

                    <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest leading-relaxed">
                        Changes to settings are applied immediately <br /> to the live customer experience.
                    </p>
                </div>
            </form>
        </div>
    );
}
