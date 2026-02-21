import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "NetQuest — Learn Networking",
  description: "A gamified networking/IT learning game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NetQuest",
  },
};

export const viewport: Viewport = {
  themeColor: "#00f0ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`
        }} />
      </head>
      <body className="pb-20">
        <main className="max-w-lg mx-auto px-4 pt-4">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
