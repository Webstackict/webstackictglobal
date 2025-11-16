"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function updatePassword(userId, prevState, formData) {
  const newPassword = formData.get("newPassword")?.trim() || "";
  const confirmPassword = formData.get("confirmPassword")?.trim() || "";

  const cookieStore = await cookies();

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

  try {
    const { error: pwdError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password: newPassword,
      }
    );

    if (pwdError) throw pwdError;

    const { error: metaError } = await supabase.auth.admin.updateUserById(
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
