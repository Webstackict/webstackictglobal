"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function resendVerification(email, lastResend) {
  const now = Date.now();
  const last = lastResend ? new Date(lastResend).getTime() : 0;

  if (now - last < 60 * 1000) {
    return {
      success: false,
      error: "You can only resend once every 60 seconds.",
    };
  }

  const supabase = await createAdminClient();

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
