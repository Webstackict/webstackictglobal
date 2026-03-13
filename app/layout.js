import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/styles/colors.css";
import NotificationsContextProvider from "@/store/notifications-context";
import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import UserContextProvider from "@/store/user-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Webstack ICT Global | Africa's Premier Tech Hub",
  description:
    "Join WEBSTACK's premium training programs and transform your career with hands-on experience in web development, data science, cybersecurity, and emerging technologies.",
  // Primary canonical domain for the production project. Ensure all absolute URLs use this domain.
  metadataBase: new URL("https://webstackict.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico", // Using existing icon as apple-touch-icon for compatibility
  },
  openGraph: {
    title: "Webstack ICT Global | Africa's Premier Tech Hub",
    description: "Empowering Africa's next generation of tech professionals with world-class training and mentorship.",
    url: "https://webstackict.com",
    siteName: "Webstack ICT Global",
    images: [
      {
        url: "/logo/webstack-logo-dark.png",
        width: 1200,
        height: 630,
        alt: "Webstack ICT Global - Africa's Premier Tech Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webstack ICT Global | Africa's Premier Tech Hub",
    description: "Build Your Tech Future in Africa with WEBSTACK's premium training programs.",
    images: ["https://webstackict.com/logo/webstack-logo-dark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { prisma } from "@/lib/prisma";

export default async function GeneralLayout({ children }) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notifications = [];
  let userDetails = null;
  let isUnread = false;

  if (user) {
    try {
      // 1. Fetch user profile and notifications via Prisma for stability
      const [profile, userNotifications] = await Promise.all([
        prisma.user_profile.findUnique({
          where: { user_id: user.id }
        }),
        prisma.notifications.findMany({
          where: { user_id: user.id },
          orderBy: { created_at: 'desc' },
          take: 20
        })
      ]);

      // Convert BigInt IDs and DateTime objects from Prisma for safe serialization
      notifications = userNotifications.map(n => ({
        ...n,
        id: n.id.toString(), // BigInt to String
        created_at: n.created_at?.toISOString(),
        updated_at: n.updated_at?.toISOString()
      }));

      isUnread = notifications.some((n) => n.status === "pending");

      userDetails = {
        id: user.id,
        email: user.email,
        phone: profile?.phone || "",
        fullName: profile?.full_name || user.user_metadata?.full_name || "User",
        displayName: profile?.display_name || "",
        authProviders: user.app_metadata.providers,
      };
    } catch (error) {
      console.error("Prisma/Supabase layout fetch error:", error.message);
      // Fallback UI
      notifications = [];
      userDetails = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || "User",
        authProviders: user.app_metadata.providers,
      };
      isUnread = false;
    }
  }

  // console.log("note", notifications);

  return (
    <html lang="en" className={inter.className}>
      <head />
      <body suppressHydrationWarning>
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
