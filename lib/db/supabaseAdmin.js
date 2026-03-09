import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseURL || !supabaseServiceKey) {
    if (process.env.NODE_ENV !== "production") {
        console.warn("Supabase Admin Client: Missing environment variables. This is required for server-side operations.");
    }
}

export const supabaseAdmin = createClient(
    supabaseURL || "",
    supabaseServiceKey || "",
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
