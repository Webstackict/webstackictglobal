
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import { Coins, Clock, CheckCircle, CreditCard, ChevronLeft, Zap, Trophy, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EarningsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 0. Access Control: Check affiliate status
    const { data: profile } = await supabase
        .from("user_profile")
        .select("affiliate_status")
        .eq("user_id", user.id)
        .single();

    if (profile?.affiliate_status !== 'approved') {
        redirect("/dashboard/referrals");
    }

    // Fetch earnings summary
    const { data: activities } = await supabase
        .from("referral_activities")
        .select("commission_amount, status")
        .eq("referrer_id", user.id);

    const stats = {
        total: activities?.reduce((acc, curr) => acc + Number(curr.commission_amount), 0) || 0,
        pending: activities?.filter(a => a.status === 'pending').reduce((acc, curr) => acc + Number(curr.commission_amount), 0) || 0,
        approved: activities?.filter(a => a.status === 'approved').reduce((acc, curr) => acc + Number(curr.commission_amount), 0) || 0,
        paid: activities?.filter(a => a.status === 'paid').reduce((acc, curr) => acc + Number(curr.commission_amount), 0) || 0,
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4">
            <DashboardHeader
                title="Settlement Ledger"
                subtitle="Track your commissions performance and payout status."
                userId={user.id}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/referrals" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-bold uppercase tracking-widest mb-4 group transition-colors">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Console
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Asset", val: `₦${stats.total.toLocaleString()}`, sub: "Lifetime Earnings", icon: Trophy, color: "text-blue-500", bg: "bg-blue-600/5" },
                    { label: "Pending", val: `₦${stats.pending.toLocaleString()}`, sub: "Awaiting Review", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/5" },
                    { label: "Approved", val: `₦${stats.approved.toLocaleString()}`, sub: "Ready for Payout", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-600/5" },
                    { label: "Paid Out", val: `₦${stats.paid.toLocaleString()}`, sub: "Settled Funds", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-600/5", highlight: true }
                ].map((stat, i) => (
                    <div key={i} className={`premium-card p-5 lg:p-6 flex flex-col justify-between min-h-[140px] ${stat.highlight ? 'border-emerald-500/20' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                            <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
                            <div className="pro-stat-label">{stat.label}</div>
                        </div>
                        <div>
                            <div className="text-xl lg:text-2xl font-black text-white tracking-tighter mb-1">{stat.val}</div>
                            <div className="pro-stat-label !normal-case !text-gray-500">{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card p-8 lg:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                    <ShieldCheck className="w-64 h-64 text-white -rotate-12 transform translate-x-20 -translate-y-20" />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                                <Coins className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl pro-heading text-white uppercase">Payout Information</h2>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-500" />
                                Weekly Commission Cycle
                            </h3>
                            <p className="pro-subtext text-base">
                                Commissions are processed every <span className="text-white font-bold">Friday</span> for all verified referrals. Funds are settled directly to your connected bank account.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/dashboard/profile" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-center">
                                Manage Payout Account
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
                        <div className="pro-stat-label">Partner Compliance</div>
                        <ul className="space-y-4">
                            {[
                                "KYC verification must be complete",
                                "Minimum payout threshold is ₦5,000",
                                "Referrals must be verified (no fraud)",
                                "Payouts are final once processed"
                            ].map((rule, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
