
import DashboardHeader from "@/components/dashboard/dashboard-header";
import MyProfileForm from "@/components/dashboard/my-profile-form";
import PasswordChangeForm from "@/components/dashboard/password-change-form";
import Section from "@/components/dashboard/section";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export default async function MyProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch affiliate status and payout details
    const { data: profile } = await supabase
        .from("user_profile")
        .select("affiliate_status, bank_name, account_name, account_number, payout_method")
        .eq("user_id", user.id)
        .maybeSingle();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <DashboardHeader
                title="My Profile"
                subtitle="Manage your personal information and account settings"
            />

            <Section title="Basic Information" description="Update your personal details and profile photo">
                <MyProfileForm affiliateData={profile} />
            </Section>

            <Section title="Security Settings" description="Update your password to keep your account secure">
                <PasswordChangeForm />
            </Section>
        </div>
    );
}
