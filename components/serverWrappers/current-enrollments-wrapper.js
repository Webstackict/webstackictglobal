import React from "react";
import CurrentEnrollmentsGrid from "../dashboard/current-enrollments-grid";
import { getUserEnrolledCohorts } from "@/lib/db/dashboard/get-active-enrolled-cohorts";


export default async function CurrentEnrollmentsWrapper({ userId }) {
  // const userId = "1d3be644-dce1-4d93-8a13-8fc40783d203";

  const { data, error } = await getUserEnrolledCohorts(userId, "in_progress");
  // console.log("data", data);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <CurrentEnrollmentsGrid enrollments={data} />;
}
