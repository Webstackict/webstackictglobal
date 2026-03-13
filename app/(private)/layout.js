import classes from "./layout.module.css";
import SideNav from "@/components/dashboard/side-nav";
import UserContextProvider from "@/store/user-context";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";
import DashboardSidebarContextProvider from "@/store/dashboard-sidebar-context";
import SideNavMobile from "@/components/dashboard/sideNavMobile";
import Main from "@/components/dashboard/main";
export default async function DashboardLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // No need to fetch userDetails here as it's provided by the root layout's UserContextProvider

  return (
    <>
      <DashboardSidebarContextProvider>
        <SideNav />
        <SideNavMobile />
        <div className={classes.dashboard}>
          <Main>{children}</Main>
        </div>
      </DashboardSidebarContextProvider>
    </>
  );
}
