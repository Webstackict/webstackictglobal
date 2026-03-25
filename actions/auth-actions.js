"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const Next_Base_URL = process.env.NEXT_PUBLIC_SITE_URL;
export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  let errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }
  if (password?.trim() !== confirmPassword?.trim()) {
    errors.confirmPassword = "Passwords must match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const supabase = await createClient();

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${Next_Base_URL}/auth/callback`,
        data: {
          onboarding_completed: false,
        }
      }
    });

    if (signUpError) {
      return { errors: { email: signUpError.message } };
    }
  } catch (error) {
    console.error("Supabase", error.message);
    return { errors: { email: "Failed to create account. Please try again later." } };
  }
  revalidatePath("/");
  return {
    success: true,
    message: "Account created successfully. Please check your email to confirm.",
  };
}

export async function signin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !email.includes("@")) return { errors: { email: "Invalid email" } };
  if (!password) return { errors: { password: "Password required" } };

  const supabase = await createClient();

  try {
    const { error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signinError) {
      return { errors: { email: signinError.message } };
    }
  } catch (error) {
    return { errors: { email: "Login failed." } };
  }

  revalidatePath("/");
  return { success: true, message: "Login successful" };
}

export async function completeOnboarding(prevState, formData) {
  const fullName = formData.get("fullName");
  if (!fullName) return { errors: { fullName: "Full Name is required" } };

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { errors: { global: "Authentication required" } };

  try {
    // 1. Update user metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { onboarding_completed: true, full_name: fullName }
    });
    if (authError) throw authError;

    // 2. Upsert profile
    const { error: profileError } = await supabase.from('user_profile').upsert({
      user_id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString()
    });
    if (profileError) throw profileError;

  } catch (error) {
    console.error("Onboarding Error:", error.message);
    return { errors: { global: "Failed to complete onboarding. Please try again." } };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function signinWithMagicLink(prevState, formData) {
  const email = formData.get("email");
  if (!email || !email.includes("@")) {
    return { errors: { email: "Please enter a valid email address" } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${Next_Base_URL}/auth/callback`,
    },
  });

  if (error) return { errors: { email: error.message } };

  return { success: true, message: "Magic link sent! Check your email." };
}

export async function resetPasswordForEmail(prevState, formData) {
  const email = formData.get("email");
  if (!email || !email.includes("@")) {
    return { errors: { email: "Please enter a valid email address" } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${Next_Base_URL}/reset-password`,
  });

  if (error) return { errors: { email: error.message } };

  return { success: true, message: "Password reset link sent! Check your email." };
}

export async function updatePassword(prevState, formData) {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || password.length < 8) {
    return { errors: { password: "Password must be at least 8 characters long" } };
  }
  if (password !== confirmPassword) {
    return { errors: { confirmPassword: "Passwords must match" } };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { errors: { password: error.message } };

  return { success: true, message: "Password updated successfully." };
}

export async function inviteUser(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${Next_Base_URL}/auth/callback`,
  });

  if (error) throw error;
  return { success: true, data };
}

export async function reauthenticate(password) {
  const supabase = await createClient();

  const { error } = await supabase.auth.reauthenticate({ password });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function changeEmail(newEmail) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ email: newEmail }, {
    emailRedirectTo: `${Next_Base_URL}/dashboard`
  });

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Verification emails sent to both addresses." };
}

// export async function logout() {
//   await destroySession();
//   return { success: true };
// }
