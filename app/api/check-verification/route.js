import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  const body = await req.json();
  const email = body.email;
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseURL, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data: userRaw, error: listError } =
    await supabase.auth.admin.listUsers({
      filter: `email=eq.${email}`,
    });

  const users = userRaw.users;

  const user = users.find((u) => u.email === email);

  return Response.json({
    verified: user?.user_metadata?.email_verified || false,
  });
}
