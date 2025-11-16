"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
// const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function signInWithGoogle() {
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${NEXT_BASE_URL}/auth/callback`,
    },
  });

  if (error) throw error;

  return data.url;
}
