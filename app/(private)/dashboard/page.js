import Section from "@/components/dashboard/section";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import OverviewStatsWrapper from "@/components/serverWrappers/overview-stats-wrapper";
import CurrentEnrollmentsWrapper from "@/components/serverWrappers/current-enrollments-wrapper";
import AttendedEventsWrapper from "@/components/serverWrappers/attended-events-wrapper";
import QuickActions from "@/components/dashboard/quick-actions";
import CompletedEnrollmentsWrapper from "@/components/serverWrappers/completed-enrollments-wrapper";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('user_profile')
    .select('full_name')
    .eq('user_id', user.id)
    .maybeSingle();

  const displayName = profile?.full_name || user.user_metadata?.full_name || "Student";

  return (
    <>
      <DashboardHeader
        title={`Welcome, ${displayName} 👋`}
        subtitle="Here's your learning progress overview. Keep growing."
        userId={user.id}
      />
      <Section label="overview-stats">
        <OverviewStatsWrapper userId={user.id} />
      </Section>
      <Section
        title="Active Learning Paths"
        description="Track your active programs and progress"
      >
        <CurrentEnrollmentsWrapper userId={user.id} />
      </Section>
      <Section
        title="Completed Programs"
        description="Your achievements and earned certificates"
      >
        <CompletedEnrollmentsWrapper userId={user.id} />
      </Section>
      <Section
        title="Events Attended"
        description="Your participation history in Webstack events"
      >
        <AttendedEventsWrapper userId={user.id} />
      </Section>
      <Section label="quick-actions">
        <QuickActions />
      </Section>
    </>
  );
}
