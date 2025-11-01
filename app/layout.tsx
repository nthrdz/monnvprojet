import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { SessionProvider } from "@/components/providers/session-provider";
import { AffiliateTracker } from "@/components/affiliate-tracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Athlink - Le Profil Digital des Athlètes",
  description: "Partage tes performances, trouve des sponsors, développe ta communauté. Le link-in-bio conçu pour les sportifs.",
  keywords: ["athlète", "running", "cyclisme", "triathlon", "link-in-bio", "sponsor", "performance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* 🎯 REWARDFUL - Tracking d'affiliation */}
        {process.env.NEXT_PUBLIC_REWARDFUL_API_KEY && (
          <Script
            src="https://r.wdfl.co/rw.js"
            data-rewardful={process.env.NEXT_PUBLIC_REWARDFUL_API_KEY}
            strategy="afterInteractive"
          />
        )}
        
        <SessionProvider>
          <AffiliateTracker />
          <ConditionalNavbar />
          {children}
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
