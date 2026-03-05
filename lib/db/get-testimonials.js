import { supabaseAdmin as supabase } from "./supabaseAdmin";

export async function getTestimonials() {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[DEBUG] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
            console.error("[DEBUG] Full Error Object:", JSON.stringify(error, null, 2));
            console.error("Supabase error fetching testimonials:", error.message, error.hint);
            throw error;
        }
        return { data, error: null };
    } catch (err) {
        console.error("[DEBUG] Caught error in getTestimonials:", err);
        console.error("[DEBUG] Supabase URL was:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        return { data: null, error: err };
    }
}
