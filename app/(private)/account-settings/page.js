import DashboardHeader from "@/components/dashboard/dashboard-header";
import NameChangeForm from "@/components/dashboard/name-change-form";
import PasswordChangeForm from "@/components/dashboard/password-change-form";
import Section from "@/components/dashboard/section";

export default function AccountSettings() {
  return (
    <>
      <DashboardHeader
        title="Account Settings"
        subtitle="Manage your account and password"
      />

      <Section>
        <NameChangeForm />
        <PasswordChangeForm />
      </Section>
    </>
  );
}
