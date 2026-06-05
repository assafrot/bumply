import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DevBanner } from "@/components/layout/dev-banner";
import { he } from "@/lib/i18n/he";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: he.meta.title,
  description: he.meta.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: he.appName,
  },
};

export const viewport: Viewport = {
  themeColor: "#fff1f2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-rose-50/30 font-sans">
        <AuthProvider>
          <DevBanner />
          <main className="flex-1 pb-20 max-w-lg mx-auto w-full">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
