import MainHeader from "@/components/main-header";
import Footer from "@/components/footer";
import MainSidebarContextProvider from "@/store/main-sidebar-context";
import FilterContextProvider from "@/store/filter-context";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";


export default async function PublicLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <MainSidebarContextProvider>

          <FilterContextProvider>
            <MainHeader user={user} />
            {children}
            <Footer />
          </FilterContextProvider>
 
      </MainSidebarContextProvider>
    </>
  );
}
