import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import NotificationsWrapper from "@/components/serverWrappers/notifications-wrapper";
import React, { Suspense } from "react";

export default function NotificationsPage() {
  return (
    <>
      <DashboardHeader
        title="Notifications"
        subtitle="Manage your notifications"
      />

      <Section>
        <Suspense fallback={<p>Loading Notifications</p>}>
          <NotificationsWrapper />
        </Suspense>
      </Section>
    </>
  );
}
