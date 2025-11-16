"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function resendVerification(email, lastResend, userId) {
  const now = Date.now();
  const last = lastResend ? new Date(lastResend).getTime() : 0;

  if (now - last < 60 * 1000) {
    return {
      success: false,
      error: "You can only resend once every 60 seconds.",
    };
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseURL, serviceRoleKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    error: null,
    sentAt: new Date().toISOString(),
  };
}
