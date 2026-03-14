import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { prisma } from "@/lib/prisma";
import ReviewForm from "@/components/dashboard/ReviewForm";
import Section from "@/components/section";

export const metadata = {
    title: "Share Your Experience | Webstack ICT Global",
    description: "Tell us about your journey with Webstack ICT Global.",
};

export default async function ReviewsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch enrolled programs to allow user to pick which program they are reviewing
    const enrollments = await prisma.enrollments.findMany({
        where: {
            user_id: user.id,
            payment_status: 'PAID'
        },
        include: {
            program: {
                select: {
                    name: true
                }
            }
        }
    });

    const enrolledPrograms = enrollments.map(e => ({ name: e.program.name }));

    // Get user profile details for auto-filling
    const profile = await prisma.user_profile.findUnique({
        where: { user_id: user.id }
    });

    const userDetails = {
        fullName: profile?.full_name || user.user_metadata?.full_name || "",
        email: user.email
    };

    return (
        <div style={{ padding: "1rem 0" }}>
            <ReviewForm
                userDetails={userDetails}
                enrolledPrograms={enrolledPrograms}
            />
        </div>
    );
}
