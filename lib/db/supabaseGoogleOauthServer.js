"use server";

import { createClient } from "@/lib/supabase/server";

const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${NEXT_BASE_URL}/auth/callback`,
    },
  });

  if (error) throw error;

  return data.url;
}
