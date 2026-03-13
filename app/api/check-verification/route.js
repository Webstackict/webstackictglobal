import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req) {
  const body = await req.json();
  const email = body.email;

  const supabase = await createAdminClient();

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
