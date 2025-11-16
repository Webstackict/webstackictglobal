import React from "react";
import Notifications from "../dashboard/notifications";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";

export default async function NotificationsWrapper() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="data-fetching-error">User not authenticated</p>;
  }

  try {
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (updateError) throw updateError;

    const { data: items, error: fetchError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    return <Notifications items={items} />;
  } catch (error) {
    console.error("Supabase error:", error.message);
    return (
      <p className="data-fetching-error">
        Something went wrong, please try again.
      </p>
    );
  }
}
