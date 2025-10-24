import { Toaster } from "sonner";
import "./globals.css";
import "@/lib/styles/colors.css";

import MainHeader from "@/components/main-header";
import Footer from "@/components/footer";
import MainSidebarContextProvider from "@/store/main-sidebar-context";

export const metadata = {
  title: "Webstack-ICT-Global",
  description: "Africa's Premier Tech Hub",
  icons: {
    icon: "/favicon.ico",
  },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MainSidebarContextProvider>
          <MainHeader />
          {children}

          <Footer />
          <Toaster />
        </MainSidebarContextProvider>
      </body>
    </html>
  );
}
