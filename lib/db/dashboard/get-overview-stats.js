"use server";
import { supabase } from "../supabaseClient";

export async function getOverviewStats(userId) {
  try {
    const [attendedResult, completedDeptsResult, ongoingResult] =
      await Promise.all([
        supabase
          .from("event_attendees")
          .select("*", { count: "exact", head: true })
          .eq("registered_attendee_id", userId),
        supabase.rpc("get_user_academy_journey", {
          user_id_input: userId,
          cohort_status_input: "completed",
        }),
        supabase.rpc("get_user_academy_journey", {
          user_id_input: userId,
         cohort_statuses_csv: "in_progress,enrolling"
        }),
      ]);

    const { count: attendedEvents, error: attendedEventsError } =
      attendedResult;
    const { data: completedDepts, error: completedDeptsError } =
      completedDeptsResult;
    const { data: ongoingEnrollments, error: ongoingEnrollmentsError } =
      ongoingResult;

    if (attendedEventsError || completedDeptsError || ongoingEnrollmentsError)
      throw (
        attendedEventsError || completedDeptsError || ongoingEnrollmentsError
      );

    return {
      data: {
        attendedEvents,
        completedDepts: completedDepts[0]?.total ?? 0,
        ongoingEnrollments:
          ongoingEnrollments[0]?.total ?? 0,
      },
      error: null,
    };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}
