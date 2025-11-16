import { Toaster } from "sonner";
import "./globals.css";
import "@/lib/styles/colors.css";
import NotificationsContextProvider from "@/store/notifications-context";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import UserContextProvider from "@/store/user-context";

export const metadata = {
  title: "Webstack-ICT-Global",
  description: "Africa's Premier Tech Hub",
  openGraph: {
    images: [
      {
        url: "https://webstack-ict-global.vercel.app/logo/webstack-logo-dark.png",
        width: 100,
        height: 100,
        alt: "Webstack Banner",
      },
    ],
  },
};

export default async function GeneralLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notifications;
  let userDetails;
  let isUnread;

  if (user) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;

      notifications = data;

      isUnread = data.some((n) => n.status === "pending");

      userDetails = {
        id: user.id,
        email: user.email,
        phone: data.phone || "",
        fullName: data.full_name || user.user_metadata?.full_name || "",
        displayName: data.display_name || "",
        authProviders: user.app_metadata.providers,
      };
    } catch (error) {
      console.error("Supabase error", error.message);
      return (
        <p className="data-fetching-error ">
          Something Went Wrong, please try again
        </p>
      );
    }
  }

  // console.log("note", notifications);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <UserContextProvider userDetails={userDetails}>
          <NotificationsContextProvider
            items={notifications}
            isUnread={isUnread}
          >
            {children}
            <Toaster />
          </NotificationsContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
