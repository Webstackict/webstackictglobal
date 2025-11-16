"use server";

import { supabase } from "@/lib/db/supabaseClient";

export async function updateNames(userId, prevState, formData) {
  const fullName = formData.get("fullName")?.trim() || "";
  const displayName = formData.get("displayName")?.trim() || "";
  const phone = formData.get("phone")?.trim() || "";

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
      .update({ full_name: fullName, display_name: displayName, phone: phone })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
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

