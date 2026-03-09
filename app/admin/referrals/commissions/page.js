"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, CreditCard, Filter, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CommissionsManagementPage() {
    const [commissions, setCommissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [filter, setFilter] = useState("all");

    const fetchCommissions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/referrals/commissions");
            const data = await res.json();
            if (res.ok) {
                setCommissions(data.commissions || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleStatusUpdate = async (activityId, newStatus) => {
        if (!confirm(`Mark this commission as ${newStatus}?`)) return;

        setIsUpdating(true);
        try {
            const res = await fetch("/api/admin/referrals/commissions", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activityId, status: newStatus }),
            });
            if (res.ok) {
                toast.success(`Commission marked as ${newStatus}`);
                fetchCommissions();
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredCommissions = filter === "all"
        ? commissions
        : commissions.filter(c => c.status === filter);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Commission Management</h1>
                <p className="text-sm text-gray-400 mt-1">Review and process affiliate commission payouts.</p>
            </div>

            <div className="flex items-center gap-4 bg-[#0a0e17] border border-white/5 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <Filter className="w-4 h-4" /> Filter:
                </div>
                <div className="flex gap-2">
                    {["all", "pending", "approved", "paid"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${filter === s
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                                }`}
                        >
                            {s.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-sm font-medium text-gray-400 bg-white/[0.02]">
                                <th className="px-6 py-4">Beneficiary (Referrer)</th>
                                <th className="px-6 py-4">Referred User</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading commissions...
                                    </td>
                                </tr>
                            ) : filteredCommissions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        No commissions found for this filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredCommissions.map((comm) => (
                                    <tr key={comm.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{comm.referrer?.user_profile?.full_name || "N/A"}</div>
                                            <div className="text-xs text-gray-500">{comm.referrer?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{comm.referred_user?.user_profile?.full_name || "N/A"}</div>
                                            <div className="text-xs text-gray-500">{comm.referred_user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 capitalize font-medium">{comm.referral_type}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-400">₦{Number(comm.commission_amount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${comm.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    comm.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {comm.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {comm.status === 'approved' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(comm.id, 'paid')}
                                                    disabled={isUpdating}
                                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <CreditCard className="w-3 h-3" /> Mark as Paid
                                                </button>
                                            )}
                                            {comm.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(comm.id, 'approved')}
                                                    disabled={isUpdating}
                                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <CheckCircle className="w-3 h-3" /> Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
