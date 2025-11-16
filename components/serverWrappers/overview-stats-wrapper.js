import { getOverviewStats } from "@/lib/db/dashboard/get-overview-stats";
import OverviewStatsGrid from "../dashboard/overview-stats-grid";


export default async function OverviewStatsWrapper({ userId }) {

  const { data, error } = await getOverviewStats(userId);

  if (error) return <p className="data-fetching-error">Something went wrong</p>;

  // console.log('data', data);

  return <OverviewStatsGrid userStats={data} />;
}
