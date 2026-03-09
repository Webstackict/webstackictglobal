import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseKey) {
    if (process.env.NODE_ENV !== "production") {
        console.warn("Supabase Public Client: Missing environment variables.");
    }
}

export const supabase = createClient(
    supabaseURL || "",
    supabaseKey || ""
);
