
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import CurrentEnrollmentsWrapper from "@/components/serverWrappers/current-enrollments-wrapper";
import CompletedEnrollmentsWrapper from "@/components/serverWrappers/completed-enrollments-wrapper";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";

export default async function EnrollmentsPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <DashboardHeader
                title="My Enrollments"
                subtitle="Manage your learning paths and track your progress"
                userId={user.id}
            />

            <Section
                title="Active Learning Paths"
                description="Programs you are currently enrolled in"
            >
                <CurrentEnrollmentsWrapper userId={user.id} />
            </Section>

            <Section
                title="Completed Programs"
                description="Your learning achievements and certificates"
            >
                <CompletedEnrollmentsWrapper userId={user.id} />
            </Section>
        </div>
    );
}
