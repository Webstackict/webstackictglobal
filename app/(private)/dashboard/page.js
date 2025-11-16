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

  console.log("user", user);

  if (!user) {
    redirect("/auth");
  }

  return (
    <>
      <DashboardHeader
        title=""
        subtitle="Here's your learning progress overview. Keep growing."
        userId={user.id}
      />
      <Section label="overview-stats">
        <OverviewStatsWrapper userId={user.id} />
      </Section>
      <Section
        title="Ongoing Departments"
        description="Track your active learning paths"
      >
        <CurrentEnrollmentsWrapper userId={user.id} />
      </Section>
      <Section
        title="Completed Departments"
        description="Your achievements and earned certificates"
        buttonText="Enroll New Department"
        buttonIcon="add"
        href="/programs/academy"
      >
        <CompletedEnrollmentsWrapper userId={user.id} />
      </Section>
      <Section
        title="Events Attended"
        description="Your participation history in WEBSTACK events"
        buttonText="View All Events"
        buttonIcon="rightArrow"
        href="/programs/events"
      >
        <AttendedEventsWrapper userId={user.id} />
      </Section>
      <Section label="quick-actions">
        <QuickActions />
      </Section>
    </>
  );
}
