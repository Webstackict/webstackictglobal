"use client";

import { useState, useEffect } from "react";
import { Check, X, User, Mail, Calendar, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AffiliateRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/referrals/requests");
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId, userId, status) => {
        if (!confirm(`Are you sure you want to ${status} this request?`)) return;

        setIsProcessing(true);
        try {
            const res = await fetch("/api/admin/referrals/requests", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, userId, status }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchRequests();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Affiliate Requests</h1>
                    <p className="text-sm text-gray-400 mt-1">Review and approve applications for the affiliate program.</p>
                </div>
            </div>

            <div className="bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                <th className="px-8 py-5">Application Source</th>
                                <th className="px-8 py-5">Submission Date</th>
                                <th className="px-8 py-5">Network Status</th>
                                <th className="px-8 py-5 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        <AlertCircle className="w-8 h-8 opacity-20 mx-auto mb-2" />
                                        No affiliate requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white uppercase tracking-tight">{req.users?.user_profile?.full_name || "Anonymous Partner"}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{req.users?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400 font-medium">
                                                <Calendar className="w-4 h-4 opacity-40" />
                                                {new Date(req.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleAction(req.id, req.user_id, 'approved')}
                                                        disabled={isProcessing}
                                                        className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-lg active:scale-90"
                                                        title="Approve Partner"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.id, req.user_id, 'rejected')}
                                                        disabled={isProcessing}
                                                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg active:scale-90"
                                                        title="Decline Partner"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
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
