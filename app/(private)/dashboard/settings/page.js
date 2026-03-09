
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Section from "@/components/dashboard/section";
import SecuritySettings from "@/components/dashboard/security-settings";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <DashboardHeader
                title="Settings"
                subtitle="General account preferences and privacy"
            />

            <Section title="General Preferences" description="Manage your dashboard experience">
                <div className="p-8 bg-[#0a0e17] border border-white/5 rounded-2xl text-center text-gray-500">
                    General account settings coming soon...
                </div>
            </Section>

            <Section title="Security" description="Manage your account security and authentication">
                <SecuritySettings />
            </Section>
        </div>
    );
}
