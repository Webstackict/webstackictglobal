"use client";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/store/user-context";
import { toast } from "sonner";
import { Copy, Share2, Coins, Users, Clock, AlertCircle, Trophy, Zap, ChevronRight, ExternalLink, Calendar } from "lucide-react";
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

    const refCode = referralData?.referral?.referral_code;

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
                    className="max-w-5xl mx-auto py-20 lg:py-32 px-4 lg:px-8"
                >
                    {/* Hero Section */}
                    <div className="relative mb-12 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Zap className="w-3 h-3" /> Partner Program
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-tight lg:max-w-3xl">
                            SCALE WITH THE <br />
                            <span className="text-blue-500">WEBSTACK</span> NETWORK
                        </h1>
                        <p className="text-gray-400 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
                            Join an elite circle of partners. Refer talent to Africa's premier technology academy and earn high-ticket commissions.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            { title: "TIERED REWARDS", desc: "Earn 10% on scholarship referrals and 5% on standard enrollments.", icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { title: "INSTANT SETTLEMENT", desc: "Automated payouts directly to your local or global bank account.", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { title: "ELITE ANALYTICS", desc: "Real-time tracking of your network performance and lead conversion.", icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="premium-card p-8 group hover:border-blue-500/40"
                            >
                                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <h3 className="text-white font-black text-lg mb-2 tracking-tight">{item.title}</h3>
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
                                className="glass-card-amber premium-glow-amber p-1 px-1 max-w-2xl w-full"
                            >
                                <div className="bg-[#0a0e17]/80 backdrop-blur-3xl rounded-[1.45rem] p-10 lg:p-14 text-center border border-white/5">
                                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                        <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
                                        <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight">Verification in Progress</h3>
                                    <p className="text-gray-400 text-base lg:text-lg mb-8 max-w-md mx-auto leading-relaxed font-medium">
                                        Our executive team is currently reviewing your partner application. You'll receive a confirmation email once your portal is active.
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500/60 text-xs font-bold uppercase tracking-widest">
                                        Est. Wait Time: 12-24 Hours
                                    </div>
                                </div>
                            </motion.div>
                        ) : affiliate_status === 'rejected' ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="glass-card-red premium-glow-red p-10 lg:p-14 text-center max-w-xl w-full"
                            >
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight">Application Unsuccessful</h3>
                                <p className="text-gray-400 text-base mb-8 font-medium italic">
                                    "Excellence is not an act, but a habit."
                                </p>
                                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                                    Your current application does not meet our partnership criteria. You may refine your network and re-apply in 30 days.
                                </p>
                                <button
                                    onClick={() => window.location.href = 'mailto:support@webstackict.com'}
                                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-black uppercase tracking-widest transition-colors border-b border-white/10 pb-1"
                                >
                                    <ExternalLink className="w-3 h-3" /> Request Feedback
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={handleRequestApproval}
                                className="group relative bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-6 rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/40 active:scale-95 flex items-center justify-center gap-4 text-xl tracking-tight"
                            >
                                <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                                <span className="relative">INITIALIZE PARTNERSHIP</span>
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative" />
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
                className="max-w-6xl mx-auto space-y-8 pb-16 px-4"
            >
                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                            <Trophy className="w-3 h-3" /> Partner Portal
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none">AFFILIATE <span className="text-gray-500">CONSOLE</span></h1>
                        <p className="text-gray-400 text-base lg:text-xl font-medium max-w-xl">
                            Orchestrate your network growth and monitor high-yield conversions in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="glassmorphism px-4 py-2 rounded-2xl flex items-center gap-3 border-blue-500/20">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-white text-xs font-black uppercase tracking-widest">Network Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Link Sharing Section */}
                <motion.div variants={itemVariants} className="premium-card p-1 lg:p-1 relative overflow-hidden group premium-glow-blue">
                    <div className="bg-[#0a0e17]/40 backdrop-blur-2xl rounded-[1.45rem] p-8 lg:p-12 relative z-10">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                            <Share2 className="w-80 h-80 text-white -rotate-12 transform translate-x-20 -translate-y-20" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                                        <Share2 className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Referral Engine</h2>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Deploy your unique partner link</p>
                                    </div>
                                </div>

                                <div className="relative group/link">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-lg opacity-0 group-hover/link:opacity-100 transition duration-500"></div>
                                    <div className="relative bg-black/40 border border-white/5 rounded-2xl p-2 pl-6 flex flex-col sm:flex-row items-center gap-4 hover:border-white/10 transition-all">
                                        <div className="flex-1 truncate text-gray-300 font-mono text-base lg:text-xl font-medium tracking-tight">
                                            {referralLink}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(referralLink)}
                                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                        >
                                            <Copy className="w-4 h-4" /> Copy Link
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 h-full">
                                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 lg:p-10 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group/code">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/code:opacity-100 transition-opacity duration-500"></div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 relative z-10">Unique Partner Code</div>
                                    <div className="text-4xl lg:text-5xl font-black text-white font-mono tracking-[0.2em] mb-4 relative z-10 drop-shadow-2xl">
                                        {refCode}
                                    </div>
                                    <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 relative z-10 shadow-lg shadow-emerald-500/10">
                                        VERIFIED
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                    {[
                        { label: "Network Size", val: referralData?.referral?.total_referrals || 0, sub: "Total Referrals", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Pending Yield", val: `₦${Number(referralData?.earningsStats?.pending || 0).toLocaleString()}`, sub: "Awaiting Verification", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { label: "Verified Yield", val: `₦${Number(referralData?.earningsStats?.approved || 0).toLocaleString()}`, sub: "Settlement Ready", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Settled Assets", val: `₦${Number(referralData?.earningsStats?.paid || 0).toLocaleString()}`, sub: "Total Disbursed", icon: Coins, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { label: "Lifetime Yield", val: `₦${Number(referralData?.referral?.total_earned || 0).toLocaleString()}`, sub: "Gross Earnings", icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10", highlight: true }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`premium-card p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group/stat ${stat.highlight ? 'border-blue-500/40 bg-blue-600/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'hover:border-white/20'}`}
                        >
                            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover/stat:opacity-[0.08] transition-opacity duration-500`}>
                                <stat.icon className="w-24 h-24 text-white -rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center border border-white/5`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                                <div>
                                    <div className="text-2xl lg:text-3xl font-black text-white tracking-tighter mb-1 leading-none">{stat.val}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.sub}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Recent Activities */}
                <motion.div variants={itemVariants} className="premium-card overflow-hidden premium-glow-blue border-white/5">
                    <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Referral Ledger</h3>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-0.5">Real-time Transaction History</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-w-full">
                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                        <th className="px-10 py-6 border-b border-white/5">Referred User</th>
                                        <th className="px-10 py-6 border-b border-white/5">Program Domain</th>
                                        <th className="px-10 py-6 border-b border-white/5">Status</th>
                                        <th className="px-10 py-6 border-b border-white/5 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                    {(!referralData?.activities || referralData.activities.length === 0) ? (
                                        <tr>
                                            <td colSpan="4" className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-600">
                                                    <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 border border-white/5">
                                                        <AlertCircle className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="text-xl font-black uppercase tracking-tight text-white/40">No Activity Detected</p>
                                                    <p className="text-sm mt-2 font-medium max-w-xs mx-auto">Your network is currently quiet. Deploy your partner link to begin the yield process.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        referralData.activities.map((act) => (
                                            <tr key={act.id} className="hover:bg-blue-600/5 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight text-base mb-1">{act.referred_user?.user_profile?.full_name || act.referred_user?.email || "Ghost User"}</div>
                                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" /> {isHydrated ? new Date(act.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="font-bold text-gray-400 uppercase text-xs tracking-wider">{act.cohorts?.departments?.name || "Global Program"}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        act.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                        {act.status}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="font-black text-white text-2xl tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-white/5 px-6 pb-6">
                            {(!referralData?.activities || referralData.activities.length === 0) ? (
                                <div className="py-20 text-center">
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No activity yet</p>
                                </div>
                            ) : (
                                referralData.activities.map((act) => (
                                    <div key={act.id} className="py-8 space-y-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-black text-white uppercase tracking-tight text-lg">{act.referred_user?.user_profile?.full_name || "Ghost User"}</div>
                                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">
                                                    {isHydrated ? new Date(act.created_at).toLocaleDateString() : '...'}
                                                </div>
                                            </div>
                                            <div className="font-black text-white text-xl tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{act.cohorts?.departments?.name || "Global Program"}</div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                act.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
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

                {/* Leaderboard */}
                <motion.div variants={itemVariants} className="premium-card overflow-hidden border-white/5">
                    <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                                <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Global Leaderboard</h3>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-0.5">Top Network Orchestrators</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                    <th className="px-10 py-6 border-b border-white/5">Rank</th>
                                    <th className="px-10 py-6 border-b border-white/5">Network Lead</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-center">Referrals</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-right">Lifetime Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {(!referralData?.topReferrers || referralData.topReferrers.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-16 text-center text-gray-600">
                                            Calculating network rankings...
                                        </td>
                                    </tr>
                                ) : (
                                    referralData.topReferrers.map((ref, index) => (
                                        <tr key={ref.id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className={`font-black w-10 h-10 rounded-2xl flex items-center justify-center text-base ${index === 0 ? 'bg-amber-500 shadow-xl shadow-amber-500/20 text-black' : index === 1 ? 'bg-slate-300 text-black shadow-lg shadow-white/5' : index === 2 ? 'bg-amber-800 text-white shadow-lg shadow-amber-900/5' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="font-black text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight text-lg">{ref.users?.user_profile?.full_name || "Anonymous Partner"}</div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="inline-flex items-center justify-center bg-white/5 text-gray-300 min-w-[3rem] px-4 py-2 rounded-xl text-xs font-black uppercase shadow-inner border border-white/5">
                                                    {ref.total_referrals}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right font-black text-emerald-400 text-2xl tracking-tighter font-mono">
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
