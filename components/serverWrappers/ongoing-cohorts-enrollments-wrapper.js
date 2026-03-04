import { getEnrollingCohorts } from "@/lib/db/get-active-cohorts";
import CardGrid from "../cards/card-grid";
import SeeMoreButtonServer from "../ui/see-more-button server";
import WaitlistForm from "../ui/WaitlistForm";

export default async function OngoingCohortsEnrollmentsWrapper() {
  const { data: cohorts, error } = await getEnrollingCohorts();

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  if (!cohorts || cohorts.length === 0) {
    return <WaitlistForm />;
  }

  return (
    <>
      <CardGrid items={cohorts} label="home" />
      <SeeMoreButtonServer href="/programs/academy">
        View all Departments
      </SeeMoreButtonServer>
    </>
  );
}
