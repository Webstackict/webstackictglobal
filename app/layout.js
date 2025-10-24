import { Toaster } from "sonner";
import "./globals.css";
import "@/lib/styles/colors.css";

import MainHeader from "@/components/main-header";
import Footer from "@/components/footer";
import MainSidebarContextProvider from "@/store/main-sidebar-context";

export const metadata = {
  title: "Webstack-ICT-Global",
  description: "Africa's Premier Tech Hub",
  openGraph: {
    title: `Webstack-ICT-Global`,
    description: "Africa's Premier Tech Hub",
    url: `https://webstack-ict-global.vercel.app/`,
    siteName: "Webstack-ICT-Global",
    images: [
      {
        url: "https://webstack-ict-global.vercel.app/logo/Webstack Logo white.png",
        width: 160,
        height: 50,
        alt: "Webstack Banner",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Webstack-ICT-Global",
    description: "Africa's Premier Tech Hub",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
