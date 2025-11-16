import React from "react";
import OngoingCohortsGrid from "../academy/ongoing-cohorts-grid";
import { getActiveCohorts } from "@/lib/db/get-active-cohorts";

export default async function ActiveCohortsWrapper() {
  const { data: activeCohorts, error } = await getActiveCohorts();

  if (error) return <p className="data-fetching-error">Something went wrong</p>;
  return <OngoingCohortsGrid ongoingCohorts={activeCohorts} />;
}
