"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin as supabase } from "./supabaseAdmin";

export async function registerEvent(userId, eventId) {
  try {
    const { data, error } = await supabase
      .from("event_registered_attendees")
      .insert({ user_id: userId, event_id: eventId });

    if (error) throw error;

    revalidatePath("/events");
    return { data, error: null };
  } catch (error) {
    console.error("Supabase error:", error);
    return { data: null, error: error };
  }
}
