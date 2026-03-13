"use client";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/store/user-context";
import { toast } from "sonner";
import { Copy, Share2, Coins, Users, Clock, AlertCircle, Trophy, Zap, ChevronRight, ExternalLink, Calendar, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function UserReferralsPage() {
    const { user } = useContext(UserContext);
    const [referralData, setReferralData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const [referralLink, setReferralLink] = useState("");

    useEffect(() => {
        setIsHydrated(true);
    }, []);

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
        if (user?.id) {
            fetchReferralData();
        }
    }, [user?.id]);

    const rawRefCode = referralData?.referral?.referral_code;
    const refCode = rawRefCode === "WST-WEBSTACK-I30T-2026" ? "Webstack-001A" : rawRefCode;

    useEffect(() => {
        if (refCode) {
            setReferralLink(`${window.location.origin}?ref=${refCode}`);
        }
    }, [refCode]);

    const handleRequestApproval = async () => {
        try {
            const res = await fetch("/api/dashboard/referrals/request", {
                method: "POST"
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchReferralData();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Error submitting request");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Referral link copied to clipboard!");
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 font-medium tracking-tight">Loading your affiliate dashboard...</div>;
    }

    const affiliate_status = referralData?.profile?.affiliate_status || 'none';
    const hasReferralCode = !!referralData?.referral;

    if (affiliate_status !== 'approved') {
        return (
            <>
                <DashboardHeader userId={user.id} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto py-16 lg:py-24 px-4 lg:px-8"
                >
                    {/* Hero Section */}
                    <div className="relative mb-16 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                            <Zap className="w-3 h-3 text-blue-400 animate-pulse" /> Partner Program 2.0
                        </div>
                        <h1 className="text-3xl lg:text-6xl pro-heading text-white mb-6 leading-[1.1]">
                            SCALE WITH THE <br />
                            <span className="text-gray-500 font-light">WEBSTACK</span> <span className="text-blue-500 italic">NETWORK</span>
                        </h1>
                        <p className="pro-subtext text-base lg:text-xl max-w-2xl text-gray-400">
                            Join an elite circle of partners. Refer talent to Africa&apos;s premier technology academy and earn high-ticket commissions.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { title: "TIERED REWARDS", desc: "Scale your earnings with high-ticket commission structures across all programs.", icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { title: "INSTANT SETTLEMENT", desc: "Automated payout protocols directly to your global or local bank account.", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { title: "ELITE ANALYTICS", desc: "Real-time network telemetry to track your leads and conversions.", icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="premium-card p-10 group hover:bg-white/[0.04] transition-all duration-500 border-white/5"
                            >
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>
                                <h3 className="text-white font-black text-xl mb-3 tracking-tight uppercase">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Status Action Card */}
                    <div className="flex justify-center">
                        {affiliate_status === 'pending' ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="premium-card p-1 max-w-2xl w-full border-amber-500/30 bg-amber-500/5 backdrop-blur-3xl"
                            >
                                <div className="rounded-[1.45rem] p-10 lg:p-14 text-center">
                                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                        <Clock className="w-12 h-12 text-amber-500 animate-[spin_4s_linear_infinite]" />
                                        <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                    <h3 className="text-3xl pro-heading text-white mb-4 uppercase tracking-tight">Verification in Progress</h3>
                                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                                        Our executive team is currently reviewing your partner application. You&apos;ll receive a confirmation email once your portal is active.
                                    </p>
                                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                        Est. Wait Time: <span className="text-white">12-24 Hours</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : affiliate_status === 'rejected' ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="premium-card p-10 lg:p-16 text-center max-w-xl w-full border-red-500/30 bg-red-500/5 backdrop-blur-2xl"
                            >
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl opacity-30"></div>
                                </div>
                                <h3 className="text-3xl pro-heading text-white mb-4 uppercase tracking-tight">Application Declined</h3>
                                <p className="text-gray-400 text-lg mb-10 italic leading-relaxed">
                                    &quot;Quality is never an accident; it is always the result of intelligent effort.&quot;
                                </p>
                                <p className="text-gray-500 text-sm mb-12 font-medium">
                                    Your application does not meet our current partnership criteria. You may re-apply in 30 days once you&apos;ve expanded your network.
                                </p>
                                <button
                                    onClick={() => window.location.href = 'mailto:support@webstackict.com'}
                                    className="inline-flex items-center gap-3 text-white hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b border-white/10 hover:border-blue-400/40 pb-2"
                                >
                                    <ExternalLink className="w-4 h-4" /> Request Feedback Protocol
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={handleRequestApproval}
                                className="group relative bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-7 rounded-2xl transition-all shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.5)] active:scale-95 flex items-center justify-center gap-4 text-xl tracking-[0.1em] border border-blue-400/30"
                            >
                                <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                                <span className="relative">INITIALIZE PARTNERSHIP</span>
                                <ChevronRight className="w-7 h-7 group-hover:translate-x-3 transition-transform relative" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };


    return (
        <>
            <DashboardHeader userId={user.id} />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto space-y-12 pb-24 px-4 relative"
            >
                {/* Visual Accent for Header */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>

                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12 relative overflow-hidden p-8 lg:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm group/hero">
                    {/* Interior Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover/hero:bg-blue-500/10 transition-colors duration-700"></div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <Trophy className="w-3.5 h-3.5" /> Referral Program
                        </div>
                        <h1 className="text-4xl lg:text-6xl pro-heading text-white leading-tight">
                            AFFILIATE <span className="text-gray-500 font-light font-sans tracking-tight">DASHBOARD</span>
                        </h1>
                        <p className="pro-subtext text-base lg:text-xl max-w-xl text-gray-400 font-medium">
                            Track your referrals and earnings in one place.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-emerald-500/5 backdrop-blur-3xl px-6 py-3 rounded-2xl flex items-center gap-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></div>
                            <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Network Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 mb-20">
                    {[
                        { label: "Network Size", val: referralData?.referral?.total_referrals || 0, sub: "Qualified Leads", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: 'border-blue-500/20' },
                        { label: "Pending Yield", val: `₦${Number(referralData?.earningsStats?.pending || 0).toLocaleString()}`, sub: "Verification Stage", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: 'border-amber-500/20' },
                        { label: "Verified Yield", val: `₦${Number(referralData?.earningsStats?.approved || 0).toLocaleString()}`, sub: "Available Funds", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: 'border-indigo-500/20' },
                        { label: "Settled Assets", val: `₦${Number(referralData?.earningsStats?.paid || 0).toLocaleString()}`, sub: "Direct Payouts", icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10", border: 'border-emerald-500/20' },
                        { label: "Lifetime Yield", val: `₦${Number(referralData?.referral?.total_earned || 0).toLocaleString()}`, sub: "Gross Valuation", icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10", border: 'border-purple-500/20', highlight: true }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10, scale: 1.03 }}
                            className={`premium-card p-10 flex flex-col justify-between min-h-[220px] relative overflow-hidden group/stat transition-all duration-500 ${stat.highlight ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/30 shadow-[0_20px_50px_rgba(37,99,235,0.15)]' : 'hover:bg-white/[0.04]'}`}
                        >
                            <div className={`absolute -right-4 -bottom-4 opacity-[0.05] group-hover/stat:opacity-[0.1] transition-opacity duration-500`}>
                                <stat.icon className="w-24 h-24 text-white -rotate-12" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.border} rounded-2xl flex items-center justify-center border shadow-inner`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none font-mono">
                                        {stat.val}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">{stat.sub}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Referral Hub */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 premium-card p-1 relative overflow-hidden group">
                        <div className="bg-[#0a0e17]/40 backdrop-blur-3xl rounded-[1.45rem] p-8 lg:p-12 relative z-10 h-full border border-white/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                    <Share2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-xl pro-heading text-white uppercase tracking-tight">Referral Link</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group/link">
                                    <div className="relative bg-black/40 border border-white/5 rounded-2xl p-2 pl-6 flex flex-col sm:flex-row items-center gap-4 transition-all">
                                        <div className="flex-1 truncate text-blue-100/40 font-mono text-sm tracking-tight">
                                            {referralLink}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(referralLink)}
                                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Copy className="w-3 h-3" /> Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-8 lg:p-10 h-full flex flex-col justify-center items-center text-center relative overflow-hidden border border-white/5 bg-[#0a0e17]/40 backdrop-blur-3xl">
                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-4">Partner Code</div>
                        <div className="text-3xl lg:text-4xl font-black text-white font-mono tracking-wider mb-6 break-all px-4">
                            {refCode}
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activities */}
                <motion.div variants={itemVariants} className="premium-card overflow-hidden border-white/5 bg-[#0a0e17]/30 backdrop-blur-xl mb-12">
                    <div className="px-8 py-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-500/70" />
                            <h3 className="text-lg pro-heading text-white uppercase tracking-tight">Activity Ledger</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.01]">
                                        <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">Entity</th>
                                        <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">Program</th>
                                        <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">Status</th>
                                        <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(!referralData?.activities || referralData.activities.length === 0) ? (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <p className="text-xs text-gray-500 font-medium">No activity detected yet.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        referralData.activities.map((act) => (
                                            <tr key={act.id} className="hover:bg-white/[0.02] transition-all">
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-white uppercase tracking-tight text-sm mb-1">{act.referred_user?.user_profile?.full_name || act.referred_user?.email || "User"}</div>
                                                    <div className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">
                                                        {isHydrated ? new Date(act.created_at).toLocaleDateString() : '...'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded w-fit">
                                                        {act.cohorts?.departments?.name || "Program"}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        act.status === 'approved' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                        {act.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="font-bold text-white text-xl tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-white/5 px-6 pb-4">
                            {(!referralData?.activities || referralData.activities.length === 0) ? (
                                <div className="py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-[10px]">No activity yet</div>
                            ) : (
                                referralData.activities.map((act) => (
                                    <div key={act.id} className="py-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="font-bold text-white uppercase tracking-tight text-sm">{act.referred_user?.user_profile?.full_name || "User"}</div>
                                                <div className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">
                                                    {isHydrated ? new Date(act.created_at).toLocaleDateString() : '...'}
                                                </div>
                                            </div>
                                            <div className="font-bold text-blue-400 text-lg tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{act.cohorts?.departments?.name || "Program"}</div>
                                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                act.status === 'approved' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {act.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Leaderboard Redesign */}
                <motion.div variants={itemVariants} className="premium-card overflow-hidden border-white/5 bg-[#0a0e17]/20 backdrop-blur-xl mb-20">
                    <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-amber-500/70" />
                            <h3 className="text-lg pro-heading text-white uppercase tracking-tight">Leaderboard</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 w-20">Pos</th>
                                    <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">Partner</th>
                                    <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 text-center">Referrals</th>
                                    <th className="px-8 py-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 text-right">Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(!referralData?.topReferrers || referralData.topReferrers.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-[9px]">
                                            Synchronizing...
                                        </td>
                                    </tr>
                                ) : (
                                    referralData.topReferrers.map((ref, index) => (
                                        <tr key={ref.id} className="hover:bg-white/[0.02] transition-all">
                                            <td className="px-8 py-6">
                                                <div className={`font-bold w-8 h-8 rounded-lg flex items-center justify-center text-xs ${index === 0 ? 'bg-amber-500/20 text-amber-500' : index === 1 ? 'bg-slate-300/20 text-slate-300' : index === 2 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' : 'bg-white/5 text-gray-500'}`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white uppercase tracking-tight text-sm">{ref.users?.user_profile?.full_name || "Partner"}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="text-base font-bold text-white">{ref.total_referrals}</div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-bold text-emerald-400 text-lg tracking-tighter">
                                                ₦{Number(ref.total_earned).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
