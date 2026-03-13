import { supabaseAdmin as supabase } from "./supabaseAdmin";

export async function getTestimonials() {
    try {
        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error fetching testimonials:", error.message, error.hint);
            throw error;
        }
        return { data, error: null };
    } catch (err) {
        console.error("Caught error in getTestimonials:", err);
        return { data: null, error: err };
    }
}
