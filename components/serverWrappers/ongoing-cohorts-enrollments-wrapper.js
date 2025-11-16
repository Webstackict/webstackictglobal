import { getEnrollingCohorts } from "@/lib/db/get-active-cohorts";
import CardGrid from "../cards/card-grid";
import SeeMoreButtonServer from "../ui/see-more-button server";

export default async function OngoingCohortsEnrollmentsWrapper() {
  const { data: departments, error } = await getEnrollingCohorts();

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  return (
    <>
      <CardGrid items={departments} label="home" />
      <SeeMoreButtonServer href="/programs/academy">
        View all Departments
      </SeeMoreButtonServer>
    </>
  );
}
