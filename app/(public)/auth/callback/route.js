import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function GET(req) {
  const supabase = await createClient();

  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  const type = url.searchParams.get("type"); // recovery, invite, signup, magiclink

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const user = data.user;

      // Handle password recovery
      if (type === 'recovery') {
        return NextResponse.redirect(`${NEXT_BASE_URL}/reset-password`);
      }

      // Check for onboarding completion
      const onboardingCompleted = user.user_metadata?.onboarding_completed;
      if (!onboardingCompleted && type !== 'recovery') {
        return NextResponse.redirect(`${NEXT_BASE_URL}/onboarding`);
      }

      return NextResponse.redirect(`${NEXT_BASE_URL}${next}`);
    }
  }

  // If no code or error, redirect to auth with error
  return NextResponse.redirect(`${NEXT_BASE_URL}/auth?error=auth_failed`);
}
