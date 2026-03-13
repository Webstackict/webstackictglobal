
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import { Clock, AlertCircle, ChevronLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ReferralHistoryPage() {
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

    // Fetch all referral activities
    const { data: activities } = await supabase
        .from("referral_activities")
        .select(`
            id,
            created_at,
            referral_type,
            payment_amount,
            commission_amount,
            status,
            referred_user:referred_user_id (
                email,
                user_profile (full_name)
            ),
            cohorts:cohort_id (
                departments (name)
            )
        `)
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4">
            <DashboardHeader
                title="Referral History"
                subtitle="Detailed log of all your network activities and settlements."
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

            <div className="premium-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-white">Activity Ledger</h3>
                    </div>
                </div>

                <div className="overflow-x-auto min-w-full">
                    <div className="hidden md:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="pro-table-header bg-white/[0.01]">
                                    <th className="px-8 py-4">Referred User</th>
                                    <th className="px-8 py-4">Program Domain</th>
                                    <th className="px-8 py-4">Verification</th>
                                    <th className="px-8 py-4 text-right">Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {(!activities || activities.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-600">
                                                <AlertCircle className="w-10 h-10 mb-4 opacity-20" />
                                                <p className="text-lg font-medium tracking-tight">No activities recorded yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((act) => (
                                        <tr key={act.id} className="hover:bg-white/[0.03] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{act.referred_user?.user_profile?.[0]?.full_name || act.referred_user?.email || "Ghost User"}</div>
                                                <div className="pro-stat-label mt-1 !text-[9px] !normal-case opacity-70">
                                                    {new Date(act.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-medium text-gray-400">{act.cohorts?.departments?.name || "Global Program"}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    act.status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {act.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="font-black text-white text-lg tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-white/5 px-6">
                        {(!activities || activities.length === 0) ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-500 font-medium">No network activities found.</p>
                            </div>
                        ) : (
                            activities.map((act) => (
                                <div key={act.id} className="py-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-white uppercase tracking-tight">{act.referred_user?.user_profile?.[0]?.full_name || "Ghost User"}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{new Date(act.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="font-black text-white text-lg tracking-tighter">₦{Number(act.commission_amount).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-400 font-medium">{act.cohorts?.departments?.name || "Global Program"}</div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${act.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
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
            </div>
        </div>
    );
}
