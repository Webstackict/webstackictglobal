import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const NEXT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function GET(req) {
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

  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${NEXT_BASE_URL}/auth?error=no_code`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth exchange error:", error.message);
    return NextResponse.redirect(`${NEXT_BASE_URL}/auth?error=oauth`);
  }
  return NextResponse.redirect(`${NEXT_BASE_URL}/dashboard`);
}
