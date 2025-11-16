"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseURL, supabaseKey, {
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
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
  } catch (error) {
    console.error("Supabase", error.message);
    throw error;
  }
  revalidatePath("/");
  return {
    success: true,
    message:
      "Account created successfully. Please check your email to confirm.",
  };
}

export async function signin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseURL, supabaseKey, {
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
    const { error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signinError) throw signinError;
  } catch (error) {
    console.error("Supabase", error.message);
    throw error;
  }

  revalidatePath("/");

  return {
    success: true,
    message: "Login successful",
  };
}

// export async function logout() {
//   await destroySession();
//   return { success: true };
// }
