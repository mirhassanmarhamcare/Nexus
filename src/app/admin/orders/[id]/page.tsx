
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await fetch("/api/admin/orders/get-order?id=" + id);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch("/api/admin/orders/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                setOrder({ ...order, status: newStatus });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-[#D4AF37] animate-pulse">LOADING TRANSACTION DATA...</div>;
    if (!order) return <div className="p-12 text-center text-red-500">ORDER NOT FOUND</div>;

    return (
        <div className="text-white max-w-5xl mx-auto">
            <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <Link href="/admin/orders" className="text-[10px] text-gray-500 hover:text-white mb-4 block tracking-[0.3em] font-black uppercase">← BACK TO LOGS</Link>
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-display uppercase tracking-widest text-white">Order #{order.id}</h1>
                        <span className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-black border ${order.status === 'completed' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                            order.status === 'cancelled' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                'bg-yellow-900/20 text-yellow-400 border-yellow-900/50'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs font-mono tracking-wider">{new Date(order.createdAt).toLocaleString()} • SECURE CHECKOUT</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-zinc-900 border border-white/5 rounded-sm overflow-hidden p-1 gap-1">
                        {[
                            { id: 'pending', label: 'Processing' },
                            { id: 'tailoring', label: 'In Tailoring' },
                            { id: 'quality', label: 'Quality Check' },
                            { id: 'dispatched', label: 'Dispatched' },
                            { id: 'completed', label: 'Arrived' },
                            { id: 'cancelled', label: 'Revoked' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => updateStatus(s.id)}
                                disabled={updating || order.status === s.id}
                                className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all rounded-sm ${order.status === s.id
                                    ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-50'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-zinc-900/20 border border-white/5 backdrop-blur-md rounded-sm p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-10 flex items-center gap-3">
                            <span className="w-8 h-px bg-[#D4AF37]/30"></span>
                            Manifest
                        </h3>
                        <div className="space-y-8">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="w-24 h-24 bg-black/40 border border-white/10 rounded-sm overflow-hidden flex-shrink-0">
                                        {item.img ? (
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-mono">NO_PREVIEW</div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 italic">Line Item {i + 1}</div>
                                        <h4 className="font-display text-xl uppercase tracking-wider">{item.name}</h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] text-gray-400 font-mono">QTY: 01</span>
                                            <span className="text-[10px] px-2 py-0.5 border border-white/10 text-gray-500 rounded-sm">SKU: {item.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center text-right">
                                        <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Price</div>
                                        <div className="font-mono text-[#D4AF37] text-lg font-bold">
                                            Rs. {item.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-end gap-3">
                            <div className="flex justify-between w-full max-w-xs text-xs">
                                <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                                <span className="font-mono text-white">Rs. {order.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs text-xs pb-3 border-b border-white/5">
                                <span className="text-gray-500 uppercase tracking-widest">Duty & Tax</span>
                                <span className="font-mono text-white">Rs. 0</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs mt-2">
                                <span className="text-xs text-[#D4AF37] font-black uppercase tracking-widest">Total Credit</span>
                                <span className="text-3xl font-display text-[#D4AF37]">Rs. {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button className="px-6 py-3 border border-white/10 text-gray-500 hover:text-white hover:border-white transition-all text-[10px] font-black uppercase tracking-widest">
                            Issue Refund
                        </button>
                        <button className="px-8 py-3 bg-zinc-800 text-white hover:bg-zinc-700 transition-all text-[10px] font-black uppercase tracking-widest">
                            Print Invoice ↗
                        </button>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-zinc-900/20 border border-white/5 backdrop-blur-md rounded-sm p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Client Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Full Name</div>
                                <p className="text-lg font-display uppercase tracking-wider">{order.shipping.firstName} {order.shipping.lastName}</p>
                            </div>
                            <div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Status</div>
                                <p className="text-xs text-white">{order.userId === 'guest' ? 'GUEST_USER' : `ACCOUNT_ID: ${order.userId}`}</p>
                            </div>
                            <button className="w-full mt-4 py-2 border border-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all">
                                View History
                            </button>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-zinc-900/20 border border-white/5 backdrop-blur-md rounded-sm p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Logistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Shipping Address</div>
                                <p className="text-sm text-gray-300 leading-relaxed font-mono uppercase italic">
                                    {order.shipping.address}<br />
                                    {order.shipping.city}, PK {order.shipping.postalCode}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Carrier</div>
                                <p className="text-[10px] text-white font-black uppercase tracking-widest">STANDARD_GROUND</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
