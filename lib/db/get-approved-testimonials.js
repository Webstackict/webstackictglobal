import { supabaseAdmin as supabase } from "./supabaseAdmin";

/**
 * Fetches the latest 5 approved testimonials for the homepage slider.
 * Bypassing Prisma due to persistent Client/Runtime synchronization issues.
 */
export async function getApprovedTestimonials() {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) {
            console.error("Supabase error fetching approved testimonials:", error.message);
            throw error;
        }

        return { data, error: null };
    } catch (err) {
        console.error("Error fetching approved testimonials:", err);
        return { data: null, error: err };
    }
}
