import classes from "./layout.module.css";
import SideNav from "@/components/dashboard/side-nav";
import UserContextProvider from "@/store/user-context";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import { redirect } from "next/navigation";
import DashboardSidebarContextProvider from "@/store/dashboard-sidebar-context";
import SideNavMobile from "@/components/dashboard/sideNavMobile";
import Main from "@/components/dashboard/main";
export default async function PublicLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  let userDetails;

       console.log("det", user);

  if (user?.id) {
    try {
      const { data, error } = await supabase
        .from("user_profile")
        .select("full_name, display_name, phone")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;

      // console.log("det", data);

      userDetails = {
        id: user.id,
        email: user.email,
        phone: data.phone || "",
        fullName: data.full_name || user.user_metadata?.full_name || "",
        displayName: data.display_name || "",
        authProviders: user.app_metadata.providers,
      };
    } catch (err) {
      console.error("From supabase", err);
      return;
    }
  }

  // console.log("details", userDetails);
  return (
    <>
      <UserContextProvider userDetails={userDetails}>
        <DashboardSidebarContextProvider>
          <SideNav />
          <SideNavMobile />
          <div className={classes.dashboard}>
            <Main>{children}</Main>
          </div>
        </DashboardSidebarContextProvider>
      </UserContextProvider>
    </>
  );
}
