"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function updatePassword(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error("Unauthorized");
  }

  const userId = authUser.id;
  const newPassword = formData.get("newPassword")?.trim() || "";
  const confirmPassword = formData.get("confirmPassword")?.trim() || "";

  let errors = {};

  if (newPassword.length < 8) {
    errors.newPassword = "New password must be at least 8 characters long.";
  }
  if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Password must match with new password.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const adminClient = await createAdminClient();

  try {
    const { error: pwdError } = await adminClient.auth.admin.updateUserById(
      userId,
      {
        password: newPassword,
      }
    );

    if (pwdError) throw pwdError;

    const { error: metaError } = await adminClient.auth.admin.updateUserById(
      userId,
      {
        app_metadata: {
          providers: ["google", "email"],
        },
      }
    );
    if (metaError) throw metaError;

    return { success: true, error: null };
  } catch (error) {
    console.error("Supabase", error.message);
    throw error;
  }
}
