"use server";

import { createClient } from "@/lib/supabase/server";

export const logout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
