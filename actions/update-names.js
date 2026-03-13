"use server";

import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export async function updateNames(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw new Error("Unauthorized");
  }

  const userId = authUser.id;
  const fullName = formData.get("fullName")?.trim() || "";
  const displayName = formData.get("displayName")?.trim() || "";
  const phone = formData.get("phone")?.trim() || "";
  const photoUrl = formData.get("photoUrl")?.trim() || "";

  let errors = {};

  if (fullName.length < 3) {
    errors.fullName = "Firstname must be at least 3 characters long.";
  }

  if (displayName.length < 3) {
    errors.displayName =
      "Your dispaly name must be at least 3 characters long.";
  }

  if (phone.length < 11) {
    errors.phone = "Phone numbers must be atleast 11 digits.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const { data: user, error } = await supabase
      .from("user_profile")
      .update({
        full_name: fullName,
        display_name: displayName,
        phone: phone,
        photo_url: photoUrl
      })
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase query error in updateNames:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }
    // console.log("new", user);

    return {
      user,
      error: null,
      success: true,
      message: "Account updated successfully.",
    };
  } catch (error) {
    console.error("Supabase", error.message);
    throw error;
  }
}

