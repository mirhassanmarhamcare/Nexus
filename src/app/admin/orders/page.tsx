
import { getDB } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const db = await getDB();
    const orders = db.orders.reverse(); // Show newest first

    return (
        <div className="text-white">
            <header className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl font-display uppercase tracking-widest text-white mb-2">Orders</h1>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400 tracking-wider">
                        MANAGE CUSTOMER ORDERS
                    </div>
                </div>
            </header>

            <div className="grid gap-4">
                {orders.length === 0 ? (
                    <div className="p-12 text-center border border-white/10 rounded-lg bg-zinc-900/30">
                        <p className="text-gray-500">No orders found.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/admin/orders/${order.id}`}
                            className="group block p-6 bg-zinc-900/50 border border-white/5 hover:border-[#D4AF37] transition-all rounded-lg"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono text-[#D4AF37] font-bold">{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                                order.status === 'cancelled' ? 'bg-red-900/30 text-red-400 border border-red-900' :
                                                    'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.shipping.firstName} {order.shipping.lastName}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Total</div>
                                        <div className="font-display text-lg">Rs. {order.total.toLocaleString()}</div>
                                    </div>
                                    <div className="hidden md:block px-4 py-2 border border-white/10 rounded text-xs uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                                        View Details
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
