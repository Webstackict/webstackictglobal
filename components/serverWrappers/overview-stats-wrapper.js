import { getOverviewStats } from "@/lib/db/dashboard/get-overview-stats";
import OverviewStatsGrid from "../dashboard/overview-stats-grid";


export default async function OverviewStatsWrapper({ userId }) {

  const { data, error } = await getOverviewStats(userId);

  const defaultStats = {
    attendedEvents: 0,
    completedDepts: 0,
    ongoingEnrollments: 0,
  };

  return <OverviewStatsGrid userStats={data || defaultStats} />;
}
