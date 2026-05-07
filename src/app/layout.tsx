import "./globals.css";

import Providers from "@/store/Provider";
import { Loader } from "@/components/loader";
import VisitorServiceModal from "@/components/common/VisitorServiceModal";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Tkp Store - Abonnements Streaming & Boutique en ligne",
  description: "Plateforme d'abonnements Netflix, Prime Video, Spotify, GogoFlix et boutique en ligne au Benin",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  themeColor: "#e50914",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={{ background: "none" }}>
        <Loader>
          <Providers>
            <div>{children}</div>
            <VisitorServiceModal />
          </Providers>
        </Loader>
      </body>
    </html>
  );
}
