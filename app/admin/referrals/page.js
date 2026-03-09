"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, MoreVertical, Coins, Users as UsersIcon, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function AdminReferralsPage() {
    const [referrals, setReferrals] = useState([]);
    const [stats, setStats] = useState({ total_commissions: 0, total_referrals: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState("");

    const fetchReferrals = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/referrals");
            const data = await res.json();
            if (res.ok) {
                setReferrals(data.referrals || []);
                setStats(data.stats || { total_commissions: 0, total_referrals: 0 });
            }
        } catch (error) {
            console.error("Failed to fetch referrals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!selectedUserEmail) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/admin/referrals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: selectedUserEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Referral code generated successfully!");
                setSelectedUserEmail("");
                fetchReferrals();
            } else {
                alert(data?.error || "Failed to generate referral code.");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating code.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert("Referral code copied!");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Referrals & Affiliates</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage referral codes and view commission payouts.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="premium-card p-6 relative overflow-hidden group hover:border-blue-500/40">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                        <UsersIcon className="w-24 h-24 text-white -rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Total Network Size</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter">{stats.total_referrals}</h3>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Registered affiliate partners</p>
                    </div>
                </div>

                <div className="premium-card p-6 relative overflow-hidden group hover:border-emerald-500/40">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                        <Coins className="w-24 h-24 text-white rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">System-wide Yield</p>
                        <h3 className="text-4xl font-black text-emerald-400 tracking-tighter">
                            ₦{Number(stats.total_commissions).toLocaleString()}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Total commissions processed</p>
                    </div>
                </div>
            </div>

            {/* Generate & List Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Generate New */}
                <div className="bg-[#0a0e17] border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
                    <h3 className="text-lg font-bold text-white mb-4">Generate Referral Code</h3>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Target User Email</label>
                            <input
                                type="email"
                                required
                                placeholder="Enter user's email address"
                                value={selectedUserEmail}
                                onChange={(e) => setSelectedUserEmail(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isGenerating || !selectedUserEmail}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? "Generating..." : (
                                <>
                                    <Plus className="w-4 h-4" /> Generate Code
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="lg:col-span-2 bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white">Active Referral Codes</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                    <th className="px-8 py-5">Partner Name</th>
                                    <th className="px-8 py-5">Ref Code</th>
                                    <th className="px-8 py-5 text-center">Conversions</th>
                                    <th className="px-8 py-5 text-right">Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : referrals.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 flex items-center justify-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> No referrals found.
                                        </td>
                                    </tr>
                                ) : (
                                    referrals.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{ref.users?.user_profile?.full_name || "N/A"}</div>
                                                <div className="text-xs text-gray-500">{ref.users?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md w-fit">
                                                    <span className="font-mono text-xs">{ref.referral_code}</span>
                                                    <button onClick={() => copyToClipboard(ref.referral_code)} className="hover:text-white transition-colors">
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center justify-center bg-gray-800 text-gray-300 min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium">
                                                    {ref.total_referrals}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">
                                                ₦{Number(ref.total_earned).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
