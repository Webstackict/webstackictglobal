import React from "react";
import { getUserCompletedCohorts, getUserEnrolledCohorts } from "@/lib/db/dashboard/get-active-enrolled-cohorts";
import CompletedCoursesGrid from "../dashboard/completed-courses-grid";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";

export default async function CompletedEnrollmentsWrapper({ userId }) {
  // const userId = "1d3be644-dce1-4d93-8a13-8fc40783d203";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }
  const { data, error } = await getUserCompletedCohorts(userId, "completed");
  // console.log("data", data);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <CompletedCoursesGrid enrollments={data} />;
}
