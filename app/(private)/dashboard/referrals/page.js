"use client";

import { useState, useEffect, use } from "react";
import { UserContext } from "@/store/user-context";
import { Copy, Share2, Coins, Users, Clock, AlertCircle, Trophy } from "lucide-react";

export default function UserReferralsPage() {
    const { userDetails } = use(UserContext);
    const [referralData, setReferralData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReferralData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/dashboard/referrals");
            const data = await res.json();
            if (res.ok && data.success) {
                setReferralData(data);
            }
        } catch (error) {
            console.error("Failed to fetch referral data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userDetails?.id) {
            fetchReferralData();
        }
    }, [userDetails?.id]);

    const handleGenerate = async () => {
        try {
            const res = await fetch("/api/dashboard/referrals/generate", {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                setReferralData((prev) => ({
                    ...prev,
                    referral: data.referral,
                    activities: prev?.activities || [],
                }));
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Error generating code");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading your referral details...</div>;
    }

    const hasReferralCode = !!referralData?.referral;
    const refCode = referralData?.referral?.referral_code;
    const referralLink = refCode ? `${window.location.origin}/scholarship?ref=${refCode}` : "";

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Refer & Earn</h1>
                <p className="text-gray-400 mt-2 text-sm lg:text-base">
                    Invite your friends to Webstack ICT Global. When they enroll and pay, you earn a 10% commission!
                </p>
            </div>

            {!hasReferralCode ? (
                <div className="bg-[#0a0e17] border border-white/5 rounded-2xl p-8 shadow-xl text-center max-w-2xl mx-auto mt-12">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Share2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Get Your Referral Code</h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                        Generate your unique referral code today to start inviting friends and earning commissions directly to your dashboard.
                    </p>
                    <button
                        onClick={handleGenerate}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                    >
                        Activate Affiliate Program
                    </button>
                </div>
            ) : (
                <>
                    {/* Link Sharing Section */}
                    <div className="bg-gradient-to-br from-[#0a0e17] to-[#0a0e17]/50 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Share2 className="w-48 h-48 text-white" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-xl font-bold text-white">Your Affiliate Link</h2>

                            <div className="max-w-2xl bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex-1 truncate text-gray-300 font-mono text-sm">
                                    {referralLink}
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => copyToClipboard(referralLink)}
                                        className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Copy className="w-4 h-4" /> Copy Link
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="text-sm text-gray-400">Your Code:</div>
                                <div className="bg-blue-500/10 text-blue-400 font-mono px-3 py-1 rounded-md text-sm font-medium border border-blue-500/20">
                                    {refCode}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-[#0a0e17] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-6">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Coins className="w-7 h-7 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-400 mb-1">Total Earnings</div>
                                <div className="text-3xl font-bold text-white">
                                    ₦{Number(referralData?.referral?.total_earned || 0).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0e17] border border-white/5 rounded-2xl p-6 shadow-xl flex items-center gap-6">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Users className="w-7 h-7 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-400 mb-1">Successful Referrals</div>
                                <div className="text-3xl font-bold text-white">
                                    {referralData?.referral?.total_referrals || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl overflow-hidden mt-8">
                        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-bold text-white">Recent Referrals</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-sm font-medium text-gray-400 bg-white/[0.02]">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Program</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {(!referralData?.activities || referralData.activities.length === 0) ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                                                    <p>No referrals yet. Share your code to get started!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        referralData.activities.map((act) => (
                                            <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{act.referred_user?.user_profile?.full_name || act.referred_user?.email || "Unknown"}</div>
                                                    <div className="text-xs text-gray-500">{new Date(act.created_at).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>{act.cohorts?.departments?.name || "N/A"}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {act.status === 'confirmed' || act.status === 'paid' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            {act.status.charAt(0).toUpperCase() + act.status.slice(1)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            Pending Payment
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="font-medium text-white">₦{Number(act.commission_amount).toLocaleString()}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl overflow-hidden mt-8">
                        <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-amber-400" />
                            <h3 className="text-lg font-bold text-white">Top Referrers Leaderboard</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-sm font-medium text-gray-400 bg-white/[0.02]">
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Referred By</th>
                                        <th className="px-6 py-4 text-center">Referrals Count</th>
                                        <th className="px-6 py-4 text-right">Earnings</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {(!referralData?.topReferrers || referralData.topReferrers.length === 0) ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                No top referrers found.
                                            </td>
                                        </tr>
                                    ) : (
                                        referralData.topReferrers.map((ref, index) => (
                                            <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className={`font-bold w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-amber-400 text-black' : index === 1 ? 'bg-gray-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white'}`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{ref.users?.user_profile?.full_name || "Anonymous User"}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex items-center justify-center bg-gray-800 text-gray-300 min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-medium">
                                                        {ref.total_referrals}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-emerald-400">
                                                    ₦{Number(ref.total_earned).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
